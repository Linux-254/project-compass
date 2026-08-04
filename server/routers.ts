import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
        await db.completeAssessment(input.assessmentId);
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

    addStep: protectedProcedure
      .input(
        z.object({
          goalId: z.number(),
          title: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        await db.addGoalStep(input.goalId, input.title);
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
});

export type AppRouter = typeof appRouter;
