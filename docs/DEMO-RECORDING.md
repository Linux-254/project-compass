# ReForge Functional Demo Recording

## Recorder

The repository includes two local recorder scripts:

- `scripts/record-demo.mjs` records a safe isolated public walkthrough.
- `scripts/record-auth-demo.mjs` attaches to the managed Chromium debugging session, captures live browser frames from the authenticated preview, and encodes them into `reforge-authenticated-demo.webm`.

The authenticated recorder intentionally fills fields for demonstration but does not click persistence buttons, so it does not create journal entries, goals, music profiles, or check-ins in a user's account.

## Recording command

```bash
REFORGE_PREVIEW_URL=https://<preview-host> \\
REFORGE_AUTH_DEMO_DIR=/home/ubuntu/reforge-auth-demo \\
node scripts/record-auth-demo.mjs
```

The recorder requires the managed browser to be connected and authenticated. If the browser is signed out, it can only prove the public landing page and the authentication wall; it cannot prove the protected feature pages.

## Current artifacts

Two walkthrough artifacts are available for review. The updated isolated public walkthrough is `/home/ubuntu/reforge-public-demo/page@ca1e6ad27a4f8e36d6936e2eca857c71.webm` and covers the current landing page, hero flow, and sign-in gateway. The earlier authenticated artifact is `/home/ubuntu/reforge-auth-demo/reforge-authenticated-demo.webm` and covers the protected workspace screens captured before the latest visual redesign.

The public artifact is a live browser recording rather than a set of posted-up images. The authenticated artifact was created by capturing live browser frames from the managed browser. Because the connected browser remained signed out during the final redesign pass, the authenticated artifact is supporting evidence only and must be re-recorded after a user-assisted sign-in for final acceptance.

The final release gate is therefore:

1. Connect the browser.
2. Sign in to the preview.
3. Run the authenticated recorder.
4. Review dashboard, daily check-in, journal, goals, rules & boundaries, music reset, guides, settings, newsletter, and onboarding in the generated video.
5. Complete manual acceptance without submitting personal recovery data.
