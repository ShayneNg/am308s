<script lang="ts">
  import Icon from '@iconify/svelte';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-[#020617] text-white">
  <div class="relative flex flex-col items-center p-8 border border-slate-800 rounded-2xl bg-slate-900/50 shadow-2xl">
    <div class="absolute -top-3 -right-3 flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
      </span>
      <span class="text-[10px] font-bold text-emerald-400">ONLINE</span>
    </div>

    <Icon icon="mdi:router-wireless" class="text-blue-500 mb-4" width="48" />
    
    <h1 class="text-2xl font-bold tracking-tight">IoT Network Sink</h1>
    <p class="text-slate-400 text-sm mt-1 font-mono">Status: Production Operational</p>
    
    <div class="mt-6 grid grid-cols-2 gap-4 w-full text-xs">
      <div class="p-3 border border-slate-800 rounded-lg bg-slate-950">
        <p class="text-slate-500 uppercase">Ingest Endpoint</p>
        <p class="text-blue-400">/api/ingest</p>
      </div>
      <div class="p-3 border border-slate-800 rounded-lg bg-slate-950">
        <p class="text-slate-500 uppercase">Database</p>
        <p class="text-emerald-400">Connected</p>
      </div>
    </div>
  </div>
</div>