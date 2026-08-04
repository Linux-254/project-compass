import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  router,
} from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    getRoles: protectedProcedure.query(({ ctx }) => ctx.userRoles),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // PROFILE
  // ============================================================================

  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getOrCreateProfile(ctx.user.id);
      return profile;
    }),

    update: protectedProcedure
      .input(
        z.object({
          displayName: z.string().optional(),
          timezone: z.string().optional(),
          locale: z.string().optional(),
          faithPreference: z.enum(["faith", "secular", "both"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const updated = await db.updateProfile(ctx.user.id, input);
        return updated;
      }),
  }),

  // ============================================================================
  // ONBOARDING & ASSESSMENT
  // ============================================================================

  onboarding: router({
    startAssessment: protectedProcedure.mutation(async ({ ctx }) => {
      const result = await db.createAssessment(ctx.user.id);
      return result?.[0] || null;
    }),

    saveResponse: protectedProcedure
      .input(
        z.object({
          assessmentId: z.number(),
          dimensionId: z.number(),
          response: z.record(z.string(), z.any()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.saveAssessmentResponse(
          ctx.user.id,
          input.assessmentId,
          input.dimensionId,
          input.response
        );
        return { success: true };
      }),

    completeAssessment: protectedProcedure
      .input(
        z.object({
          assessmentId: z.number(),
          substanceFocus: z.enum([
            "alcohol",
            "nicotine",
            "marijuana",
            "codeine",
            "prescription",
          ]),
          substanceFrequency: z
            .enum(["daily", "weekly", "occasional"])
            .optional(),
          substanceApproach: z.enum(["quit", "reduce"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.completeAssessment(ctx.user.id, input.assessmentId);
        await db.saveSubstanceFocus(
          ctx.user.id,
          input.substanceFocus,
          input.substanceFrequency,
          undefined,
          input.substanceApproach || "quit"
        );
        await db.getOrCreateStreak(ctx.user.id);
        return { success: true };
      }),

    getDimensions: publicProcedure.query(async ({ ctx }) => {
      return db.getLifeDimensions();
    }),

    saveScore: protectedProcedure
      .input(
        z.object({
          dimensionId: z.number(),
          score: z.number().min(0).max(100),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.saveDimensionScore(
          ctx.user.id,
          input.dimensionId,
          input.score,
          new Date()
        );
        return { success: true };
      }),

    status: protectedProcedure.query(async ({ ctx }) => {
      const [profile, substanceFocus] = await Promise.all([
        db.getOrCreateProfile(ctx.user.id),
        db.getSubstanceFocus(ctx.user.id),
      ]);
      const hasSubstance = Boolean(substanceFocus);
      return {
        assessmentStarted: Boolean(substanceFocus),
        profileComplete: Boolean(profile?.displayName),
        needsOnboarding: !hasSubstance || !profile?.displayName,
      };
    }),
  }),

  // ============================================================================
  // DASHBOARD
  // ============================================================================

  dashboard: router({
    getOverview: protectedProcedure.query(async ({ ctx }) => {
      const profile = await db.getOrCreateProfile(ctx.user.id);
      const streak = await db.getOrCreateStreak(ctx.user.id);
      const dimensionScores = await db.getLatestDimensionScores(ctx.user.id);
      const todayMorningCheckIn = await db.getTodayCheckIn(
        ctx.user.id,
        "morning"
      );
      const todayEveningCheckIn = await db.getTodayCheckIn(
        ctx.user.id,
        "evening"
      );
      const activeGoals = await db.getActiveGoals(ctx.user.id);

      return {
        profile,
        streak,
        dimensionScores,
        todayCheckIns: {
          morning: todayMorningCheckIn,
          evening: todayEveningCheckIn,
        },
        activeGoals: activeGoals.slice(0, 3),
      };
    }),

    getDimensionScores: protectedProcedure.query(async ({ ctx }) => {
      return db.getLatestDimensionScores(ctx.user.id);
    }),

    getDimensionHistory: protectedProcedure
      .input(
        z.object({
          dimensionId: z.number(),
          limit: z.number().default(30),
        })
      )
      .query(async ({ ctx, input }) => {
        return db.getDimensionScoreHistory(
          ctx.user.id,
          input.dimensionId,
          input.limit
        );
      }),
  }),

  // ============================================================================
  // CHECK-INS
  // ============================================================================

  checkIn: router({
    create: protectedProcedure
      .input(
        z.object({
          part: z.enum(["morning", "evening"]),
          mood: z.number().min(1).max(10).optional(),
          energy: z.number().min(1).max(10).optional(),
          cravings: z.number().min(1).max(10).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const today = new Date().toISOString().split("T")[0];
        await db.createCheckIn(ctx.user.id, today, input.part, {
          mood: input.mood,
          energy: input.energy,
          cravings: input.cravings,
          notes: input.notes,
        });

        // Save dimension scores based on check-in data
        if (input.mood) {
          const dimensions = await db.getLifeDimensions();
          // Save mood to mental-health dimension
          const mentalHealthDim = dimensions.find(
            d => d.slug === "mental-health"
          );
          if (mentalHealthDim) {
            await db.saveDimensionScore(
              ctx.user.id,
              mentalHealthDim.id,
              input.mood * 10,
              new Date()
            );
          }
        }

        return { success: true };
      }),

    getToday: protectedProcedure.query(async ({ ctx }) => {
      const morning = await db.getTodayCheckIn(ctx.user.id, "morning");
      const evening = await db.getTodayCheckIn(ctx.user.id, "evening");
      return { morning, evening };
    }),

    history: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(30),
          offset: z.number().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return db.listCheckIns(ctx.user.id, input.limit, input.offset);
      }),

    milestones: protectedProcedure.query(async ({ ctx }) => {
      return db.getMilestones(ctx.user.id);
    }),

    streak: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateStreak(ctx.user.id);
    }),
  }),

  // ============================================================================
  // JOURNAL
  // ============================================================================

  journal: router({
    create: protectedProcedure
      .input(
        z.object({
          body: z.string().min(1),
          dimensionId: z.number().optional(),
          promptId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createJournalEntry(
          ctx.user.id,
          input.body,
          input.dimensionId,
          input.promptId
        );
        return { success: true };
      }),

    list: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ ctx, input }) => {
        return db.getJournalEntries(ctx.user.id, input.limit, input.offset);
      }),

    update: protectedProcedure
      .input(
        z.object({
          entryId: z.number(),
          body: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateJournalEntry(ctx.user.id, input.entryId, input.body);
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ entryId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteJournalEntry(ctx.user.id, input.entryId);
        return { success: true };
      }),
  }),

  // ============================================================================
  // GOALS
  // ============================================================================

  goals: router({
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          horizon: z.enum(["30", "90", "180"]),
          dimensionId: z.number().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createGoal(
          ctx.user.id,
          input.title,
          input.horizon,
          input.dimensionId,
          input.description
        );
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getActiveGoals(ctx.user.id);
    }),

    all: protectedProcedure.query(async ({ ctx }) => {
      return db.getGoals(ctx.user.id);
    }),

    addStep: protectedProcedure
      .input(
        z.object({
          goalId: z.number(),
          title: z.string().min(1),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.addGoalStep(ctx.user.id, input.goalId, input.title);
        return { success: true };
      }),

    steps: protectedProcedure
      .input(z.object({ goalId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getGoalSteps(ctx.user.id, input.goalId);
      }),

    toggleStep: protectedProcedure
      .input(z.object({ goalId: z.number(), stepId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.toggleGoalStep(ctx.user.id, input.goalId, input.stepId);
        return { success: true };
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          goalId: z.number(),
          status: z.enum(["active", "completed", "abandoned"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateGoalStatus(ctx.user.id, input.goalId, input.status);
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ goalId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteGoal(ctx.user.id, input.goalId);
        return { success: true };
      }),
  }),

  // ============================================================================
  // RULES & BOUNDARIES
  // ============================================================================

  rules: router({
    create: protectedProcedure
      .input(
        z.object({
          text: z.string().min(1),
          reviewCadence: z.enum(["daily", "weekly", "monthly"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createRule(ctx.user.id, input.text, input.reviewCadence);
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getActiveRules(ctx.user.id);
    }),

    all: protectedProcedure.query(async ({ ctx }) => {
      return db.getRules(ctx.user.id);
    }),

    update: protectedProcedure
      .input(
        z.object({
          ruleId: z.number(),
          text: z.string().optional(),
          active: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.updateRule(ctx.user.id, input.ruleId, {
          text: input.text,
          active: input.active,
        });
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ ruleId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteRule(ctx.user.id, input.ruleId);
        return { success: true };
      }),
  }),

  // ============================================================================
  // MUSIC REHABILITATION
  // ============================================================================

  music: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateMusicProfile(ctx.user.id);
    }),

    updateProfile: protectedProcedure
      .input(
        z.object({
          triggerGenres: z.string().optional(),
          triggerArtists: z.string().optional(),
          safeGenres: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.updateMusicProfile(ctx.user.id, input);
      }),

    createPlaylist: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          context: z.string().optional(),
          tracks: z.array(z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createPlaylist(
          ctx.user.id,
          input.title,
          input.context,
          input.tracks
        );
        return { success: true };
      }),

    getPlaylists: protectedProcedure.query(async ({ ctx }) => {
      return db.getPlaylists(ctx.user.id);
    }),
  }),

  // ============================================================================
  // NEWSLETTER
  // ============================================================================

  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          source: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.subscribeToNewsletter(input.email, undefined, input.source);
        return { success: true };
      }),

    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        await db.unsubscribeFromNewsletter(input.email);
        return { success: true };
      }),

    getStatus: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.email) return undefined;
      const sub = await db.getSubscriptionByEmail(ctx.user.email);
      if (sub) return sub;
      return { email: ctx.user.email, status: "unsubscribed", preferences: {} };
    }),

    updatePreferences: protectedProcedure
      .input(
        z.object({
          preferences: z.record(z.string(), z.unknown()),
          subscribe: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user.email) return { success: false };
        if (input.subscribe === true) {
          await db.subscribeToNewsletter(
            ctx.user.email,
            ctx.user.id,
            "account"
          );
        } else if (input.subscribe === false) {
          await db.unsubscribeFromNewsletter(ctx.user.email);
        }
        await db.updateSubscriptionPreferences(
          ctx.user.email,
          input.preferences
        );
        return { success: true };
      }),

    getIssues: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return db.listNewsletterIssues(input.limit, input.offset);
      }),

    createIssue: adminProcedure
      .input(
        z.object({
          type: z.enum([
            "daily",
            "weekly",
            "milestone",
            "dimension",
            "situation",
          ]),
          subject: z.string().min(1),
          body: z.string().min(1),
          scheduledFor: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await db.createNewsletterIssue(
          input.type,
          input.subject,
          input.body,
          input.scheduledFor ? new Date(input.scheduledFor) : undefined
        );
        return { success: true };
      }),
  }),

  // ============================================================================
  // RESOURCES
  // ============================================================================

  resources: router({
    getByDimension: publicProcedure
      .input(
        z.object({
          dimensionId: z.number(),
          type: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        return db.getResourcesByDimension(input.dimensionId, input.type);
      }),

    getByType: publicProcedure
      .input(
        z.object({
          type: z.string(),
          limit: z.number().default(20),
        })
      )
      .query(async ({ input }) => {
        return db.getResourcesByType(input.type, input.limit);
      }),

    getById: publicProcedure
      .input(z.object({ resourceId: z.number() }))
      .query(async ({ input }) => {
        return db.getResourceById(input.resourceId);
      }),
  }),

  devotional: router({
    today: protectedProcedure.query(async ({ ctx }) => {
      const devotionals = await db.getResourcesByType("devotional");
      if (devotionals.length === 0) return undefined;

      const day = Math.floor(Date.now() / 86_400_000);
      const index = day % devotionals.length;
      return devotionals[index];
    }),
  }),

  // ============================================================================
  // PREFERENCES
  // ============================================================================

  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateUserPreferences(ctx.user.id);
    }),

    update: protectedProcedure
      .input(
        z.object({
          morningCheckInTime: z.string().optional(),
          eveningCheckInTime: z.string().optional(),
          notificationsEnabled: z.boolean().optional(),
          emailNotifications: z.boolean().optional(),
          musicConsent: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.updateUserPreferences(ctx.user.id, input);
      }),
  }),

  // ============================================================================
  // ADMIN (RBAC)
  // ============================================================================

  admin: router({
    listUsers: adminProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return db.listUsers(input.limit, input.offset);
      }),

    getUserRoles: adminProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return db.getUserRoles(input.userId);
      }),

    grantRole: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          role: z.enum(["supporter", "mentor", "moderator", "admin"]),
        })
      )
      .mutation(async ({ input }) => {
        await db.grantUserRole(input.userId, input.role);
        return { success: true };
      }),

    revokeRole: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          role: z.enum(["supporter", "mentor", "moderator", "admin"]),
        })
      )
      .mutation(async ({ input }) => {
        await db.revokeUserRole(input.userId, input.role);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
