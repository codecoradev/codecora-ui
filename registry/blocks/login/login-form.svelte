<!--
  Sign-in form: email, password, remember me, a submit button that shows its
  progress and an error alert. The app owns this file: wire `onsubmit` to its
  auth and change the copy, links and fields freely.
-->
<script lang="ts" module>
  export interface Credentials {
    email: string;
    password: string;
    remember: boolean;
  }
</script>

<script lang="ts">
  import { Alert, Button, Card, Checkbox, Field, Input, Link } from '@codecora/ui';

  interface Props {
    title?: string;
    description?: string;
    /** Throw an Error to show its message above the form. */
    onsubmit?: (credentials: Credentials) => Promise<void> | void;
    forgotHref?: string;
    signUpHref?: string;
  }

  let {
    title = 'Sign in',
    description = 'Welcome back. Use the email you signed up with.',
    onsubmit,
    forgotHref = '/forgot-password',
    signUpHref = '/sign-up',
  }: Props = $props();

  let email = $state('');
  let password = $state('');
  let remember = $state(true);
  let busy = $state(false);
  let error = $state('');
  let touched = $state(false);

  const emailError = $derived(
    touched && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter an email address like name@example.com.' : '',
  );
  const passwordError = $derived(touched && !password ? 'Enter your password.' : '');

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    touched = true;
    error = '';
    if (emailError || passwordError) return;
    busy = true;
    try {
      await onsubmit?.({ email, password, remember });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Sign-in failed. Try again.';
    } finally {
      busy = false;
    }
  }
</script>

<Card class="cc-login mx-auto w-full max-w-104">
  {#snippet header()}
    <h1 class="leading-heading text-xl">{title}</h1>
    <p class="text-muted-foreground">{description}</p>
  {/snippet}

  <form class="grid gap-4" novalidate onsubmit={submit}>
    {#if error}
      <Alert tone="danger" title="Could not sign in">{error}</Alert>
    {/if}
    <Field label="Email" error={emailError} required>
      {#snippet children(control)}
        <Input {...control} type="email" autocomplete="email" bind:value={email} />
      {/snippet}
    </Field>
    <Field label="Password" error={passwordError} required>
      {#snippet children(control)}
        <Input {...control} type="password" autocomplete="current-password" bind:value={password} />
      {/snippet}
    </Field>
    <div class="flex flex-wrap items-center justify-between gap-2">
      <Checkbox label="Remember me" bind:checked={remember} />
      <Link href={forgotHref}>Forgot password?</Link>
    </div>
    <Button type="submit" variant="primary" loading={busy} loadingLabel="Signing in">
      Sign in
    </Button>
  </form>

  {#snippet footer()}
    <p class="text-muted-foreground">No account yet? <Link href={signUpHref}>Create one</Link></p>
  {/snippet}
</Card>
