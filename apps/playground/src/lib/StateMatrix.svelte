<!--
  One row per control, one column per state the control can be in. Hover and
  focus need a pointer and a keyboard, so the intro points there instead of
  faking them; every other state below is the real component.
-->
<script lang="ts">
  import { Download, Trash } from '@codecora/icons/lucide';
  import { Badge, Button, Field, IconButton, Input, Select, Textarea } from '@codecora/ui';

  const columns = ['Default', 'Disabled', 'Loading', 'Invalid'] as const;
  const regions = [
    { value: 'eu', label: 'Europe' },
    { value: 'us', label: 'United States' },
  ];
</script>

<section aria-labelledby="c-matrix">
  <h2 id="c-matrix">State matrix</h2>
  <p class="muted">
    Every state a control can be in, in the theme and density chosen above. Hover and focus need
    your pointer and keyboard: hover a control, or press Tab to see the focus ring each theme draws.
  </p>

  <!-- A scrollable region must be reachable by keyboard (axe: scrollable-region-focusable). -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div class="scroll" role="region" aria-label="State matrix" tabindex="0">
    <table class="matrix">
      <thead>
        <tr>
          <th scope="col">Control</th>
          {#each columns as column (column)}<th scope="col">{column}</th>{/each}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Button</th>
          <td><Button variant="primary" icon={Download}>Export</Button></td>
          <td><Button variant="primary" disabled>Export</Button></td>
          <td><Button variant="primary" loading loadingLabel="Exporting">Export</Button></td>
          <td class="na"><span role="img" aria-label="Not applicable">–</span></td>
        </tr>
        <tr>
          <th scope="row">Danger button</th>
          <td><Button variant="danger" icon={Trash}>Revoke</Button></td>
          <td><Button variant="danger" disabled>Revoke</Button></td>
          <td><Button variant="danger" loading loadingLabel="Revoking">Revoke</Button></td>
          <td class="na"><span role="img" aria-label="Not applicable">–</span></td>
        </tr>
        <tr>
          <th scope="row">Icon button</th>
          <td><IconButton icon={Trash} label="Delete" variant="secondary" /></td>
          <td><IconButton icon={Trash} label="Delete (disabled)" disabled /></td>
          <td class="na"><span role="img" aria-label="Not applicable">–</span></td>
          <td class="na"><span role="img" aria-label="Not applicable">–</span></td>
        </tr>
        <tr>
          <th scope="row">Input</th>
          <td><Input aria-label="Default input" value="ci-deploy" /></td>
          <td><Input aria-label="Disabled input" value="locked" disabled /></td>
          <td class="na"><span role="img" aria-label="Not applicable">–</span></td>
          <td>
            <Field label="Email" error="Enter name@example.com.">
              {#snippet children(control)}<Input {...control} value="not-an-email" />{/snippet}
            </Field>
          </td>
        </tr>
        <tr>
          <th scope="row">Select</th>
          <td>
            <Field label="Region">
              {#snippet children(control)}<Select
                  {...control}
                  items={regions}
                  value="eu"
                />{/snippet}
            </Field>
          </td>
          <td>
            <Field label="Region (locked)">
              {#snippet children(control)}
                <Select {...control} items={regions} value="eu" disabled />
              {/snippet}
            </Field>
          </td>
          <td class="na"><span role="img" aria-label="Not applicable">–</span></td>
          <td>
            <Field label="Region" error="Choose a region.">
              {#snippet children(control)}<Select {...control} items={regions} value="" />{/snippet}
            </Field>
          </td>
        </tr>
        <tr>
          <th scope="row">Textarea</th>
          <td><Textarea aria-label="Default textarea" value="A note" /></td>
          <td><Textarea aria-label="Disabled textarea" value="Locked" disabled /></td>
          <td class="na"><span role="img" aria-label="Not applicable">–</span></td>
          <td>
            <Field label="Notes" error="Keep notes under 200 characters.">
              {#snippet children(control)}<Textarea {...control} value="Too long …" />{/snippet}
            </Field>
          </td>
        </tr>
        <tr>
          <th scope="row">Badge</th>
          <td class="badges" colspan="4">
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <details>
    <summary>Props</summary>
    <pre><code
        >{`<Button variant="primary|secondary|ghost|danger" icon={Icon} loading loadingLabel="Saving" href disabled />
<IconButton icon={Icon} label="Required, names the action" variant disabled />
<Field label description error required>
  {#snippet children(control)}<Input {...control} bind:value />{/snippet}
</Field>
<Select items={[{ value, label, disabled? }]} bind:value />
<Badge tone="neutral|accent|success|warning|danger" />
<Table label="Required, names the table" />   <!-- tr[data-selected="true"] marks a row -->`}</code
      ></pre>
  </details>
</section>

<style>
  section {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--cc-space-4);
    padding-bottom: var(--cc-space-10);
  }
  h2 {
    font-size: var(--cc-font-size-xl);
  }
  .muted {
    color: var(--cc-text-muted);
  }
  .scroll {
    overflow-x: auto;
  }
  .matrix {
    width: 100%;
    min-width: 44rem;
    border-collapse: collapse;
  }
  .matrix th,
  .matrix td {
    padding: var(--cc-space-3);
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--cc-border);
  }
  .matrix thead th {
    color: var(--cc-text-muted);
    font-size: var(--cc-font-size-sm);
    font-weight: 600;
  }
  .matrix tbody th {
    font-size: var(--cc-font-size-sm);
    font-weight: 500;
    white-space: nowrap;
  }
  .na {
    color: var(--cc-text-muted);
  }
  .badges {
    display: table-cell;
  }
  .badges :global(.cc-badge) {
    margin-inline-end: var(--cc-space-2);
  }
  details {
    border: 1px solid var(--cc-border);
    border-radius: var(--cc-radius-md);
    padding: var(--cc-space-3) var(--cc-space-4);
  }
  summary {
    cursor: pointer;
    font-weight: 500;
  }
  pre {
    margin: var(--cc-space-3) 0 0;
    overflow-x: auto;
    font-family: var(--cc-font-mono);
    font-size: var(--cc-font-size-sm);
  }
</style>
