<!--
  One row per control, one column per state the control can be in. Hover and
  focus need a pointer and a keyboard, so the intro points there instead of
  faking them; every other state below is the real component.
-->
<script lang="ts">
  import { Download, Trash } from '@codecora/icons/lucide';
  import {
    Badge,
    Button,
    Checkbox,
    Combobox,
    Field,
    IconButton,
    Input,
    Select,
    Slider,
    Switch,
    Textarea,
  } from '@codecora/ui';

  const columns = ['Default', 'Disabled', 'Loading', 'Invalid'] as const;
  const regions = [
    { value: 'eu', label: 'Europe' },
    { value: 'us', label: 'United States' },
  ];

  const cell = 'border-border border-b p-3 text-left align-top';
  const colHead = `${cell} text-muted-foreground text-[length:var(--cc-font-size-sm)] font-semibold`;
  const rowHead = `${cell} text-[length:var(--cc-font-size-sm)] font-medium whitespace-nowrap`;
</script>

<section aria-labelledby="c-matrix" class="grid grid-cols-1 gap-4 pb-10">
  <h2 id="c-matrix" class="text-[length:var(--cc-font-size-xl)] font-bold">State matrix</h2>
  <p class="text-muted-foreground max-w-[var(--pg-measure-intro)]">
    Every state a control can be in, in the theme and density chosen above. Hover and focus need
    your pointer and keyboard: hover a control, or press Tab to see the focus ring each theme draws.
  </p>

  <!-- A scrollable region must be reachable by keyboard (axe: scrollable-region-focusable). -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- Positioned, so absolutely placed screen-reader text stays inside the scroll box. -->
  <div
    class="relative overflow-x-auto"
    role="region"
    aria-label="Matrix of component states"
    tabindex="0"
  >
    <table class="w-full min-w-176 border-collapse">
      <thead>
        <tr>
          <th scope="col" class={colHead}>Control</th>
          {#each columns as column (column)}<th scope="col" class={colHead}>{column}</th>{/each}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class={rowHead}>Button</th>
          <td class={cell}><Button variant="primary" icon={Download}>Export</Button></td>
          <td class={cell}><Button variant="primary" disabled>Export</Button></td>
          <td class={cell}
            ><Button variant="primary" loading loadingLabel="Exporting">Export</Button></td
          >
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Danger button</th>
          <td class={cell}><Button variant="danger" icon={Trash}>Revoke</Button></td>
          <td class={cell}><Button variant="danger" disabled>Revoke</Button></td>
          <td class={cell}
            ><Button variant="danger" loading loadingLabel="Revoking">Revoke</Button></td
          >
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Icon button</th>
          <td class={cell}><IconButton icon={Trash} label="Delete" variant="secondary" /></td>
          <td class={cell}><IconButton icon={Trash} label="Delete (disabled)" disabled /></td>
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Input</th>
          <td class={cell}><Input aria-label="Default input" value="ci-deploy" /></td>
          <td class={cell}><Input aria-label="Disabled input" value="locked" disabled /></td>
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
          <td class={cell}>
            <Field label="Email" error="Enter name@example.com.">
              {#snippet children(control)}<Input {...control} value="not-an-email" />{/snippet}
            </Field>
          </td>
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Select</th>
          <td class={cell}>
            <Field label="Region">
              {#snippet children(control)}<Select
                  {...control}
                  items={regions}
                  value="eu"
                />{/snippet}
            </Field>
          </td>
          <td class={cell}>
            <Field label="Region (locked)">
              {#snippet children(control)}
                <Select {...control} items={regions} value="eu" disabled />
              {/snippet}
            </Field>
          </td>
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
          <td class={cell}>
            <Field label="Region" error="Choose a region.">
              {#snippet children(control)}<Select {...control} items={regions} value="" />{/snippet}
            </Field>
          </td>
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Textarea</th>
          <td class={cell}><Textarea aria-label="Default textarea" value="A note" /></td>
          <td class={cell}><Textarea aria-label="Disabled textarea" value="Locked" disabled /></td>
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
          <td class={cell}>
            <Field label="Notes" error="Keep notes under 200 characters.">
              {#snippet children(control)}<Textarea {...control} value="Too long …" />{/snippet}
            </Field>
          </td>
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Checkbox</th>
          <td class={cell}><Checkbox label="Receipt" checked /></td>
          <td class={cell}><Checkbox label="Receipt (locked)" disabled /></td>
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
          <td class={cell}><Checkbox label="Accept terms" invalid /></td>
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Switch</th>
          <td class={cell}><Switch label="Alerts" checked /></td>
          <td class={cell}><Switch label="Alerts (locked)" disabled /></td>
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Combobox</th>
          <td class={cell}>
            <Field label="Region">
              {#snippet children(control)}<Combobox
                  {...control}
                  items={regions}
                  value="eu"
                />{/snippet}
            </Field>
          </td>
          <td class={cell}>
            <Field label="Region (locked)">
              {#snippet children(control)}
                <Combobox {...control} items={regions} value="eu" disabled />
              {/snippet}
            </Field>
          </td>
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
          <td class={cell}>
            <Field label="Region" error="Choose a region.">
              {#snippet children(control)}<Combobox
                  {...control}
                  items={regions}
                  value=""
                />{/snippet}
            </Field>
          </td>
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Slider</th>
          <td class={cell}><Slider label="Retention" value={30} /></td>
          <td class={cell}><Slider label="Retention (locked)" value={30} disabled /></td>
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
          <td class="{cell} text-muted-foreground"
            ><span role="img" aria-label="Not applicable">–</span></td
          >
        </tr>
        <tr>
          <th scope="row" class={rowHead}>Badge</th>
          <td class="{cell} table-cell [&_.cc-badge]:me-2" colspan="4">
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

  <details class="border-border rounded-md border px-4 py-3">
    <summary class="cursor-pointer font-medium">Props</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre
      tabindex="0"
      aria-label="Component props"
      class="mt-3 overflow-x-auto font-mono text-[length:var(--cc-font-size-sm)]"><code
        >{`<Button variant="primary|secondary|ghost|danger" icon={Icon} loading loadingLabel="Saving" href disabled />
<IconButton icon={Icon} label="Required, names the action" variant disabled />
<Field label description error required>
  {#snippet children(control)}<Input {...control} bind:value />{/snippet}
</Field>
<Select items={[{ value, label, disabled? }]} bind:value />
<Badge tone="neutral|accent|success|warning|danger" />
<Checkbox label checked indeterminate invalid disabled onchange />
<Switch label checked disabled />
<RadioGroup label items={[{ value, label, description?, disabled? }]} bind:value />
<Combobox items bind:value label emptyText />   <!-- needs a label or a Field -->
<Slider label bind:value min max step format showValue />
<Table label="Required, names the table" />   <!-- tr[data-selected="true"] marks a row -->`}</code
      ></pre>
  </details>
</section>
