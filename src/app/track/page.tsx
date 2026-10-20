"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { clientData } from "@/data/zkevm-tracker";
import testMonitorSummary from "@/data/test-monitor-summary.json";
import type { TestMonitorSummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

// Explicit type so the build still type-checks when the synced data has no zkVMs
const testMonitorData: TestMonitorSummary = testMonitorSummary;

function ClientIcon({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: 'var(--accent-blue)', color: 'var(--accent-btn-text)' }}>
      {name.slice(0, 2)}
    </div>
  );
}

function ComplianceStatus({ status }: { status?: string }) {
  switch (status) {
    case 'compliant':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">Spec Compliant</Badge>;
    case 'in-progress':
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">In Progress</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">Not Started</Badge>;
  }
}

// Display names for zkVMs — the test monitor keys them by lowercase identifier
const zkvmDisplayNames: Record<string, string> = {
  airbender: "Airbender",
  jolt: "Jolt",
  lambdavm: "LambdaVM",
  openvm: "OpenVM",
  pico: "Pico",
  r0vm: "R0VM",
  zisk: "ZisK",
};

const tabs = [
  { id: "zkvm", label: "zkVM Readiness" },
  { id: "clients", label: "Ethereum Clients" },
] as const;

type TabId = typeof tabs[number]["id"];

export default function TrackPage() {
  const [activeTab, setActiveTab] = useState<TabId>("zkvm");
  const executionClients = clientData.filter(c => c.type === 'execution');
  const consensusClients = clientData.filter(c => c.type === 'consensus');

  return (
    <PageLayout
      title="Track Progress"
      description="Tracking the readiness of zkVM implementations and Ethereum client integration for ZK-based L1 scaling."
    >
      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-6 py-4 text-lg font-bold transition-colors duration-300 relative hover:text-[var(--accent-orange)]"
            style={{
              color: activeTab === tab.id ? 'var(--accent-blue)' : undefined,
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: 'var(--accent-blue)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* zkVM Readiness Tab */}
      {activeTab === "zkvm" && (
        <>
          <section className="mb-24">
            <p className="text-muted-foreground mb-2">
              ISA compliance test results from the{" "}
              <a
                href="https://eth-act.github.io/zkevm-test-monitor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] hover:underline inline-flex items-center gap-1"
              >
                RISC-V Compliance Test Monitor <ExternalLink className="w-3 h-3" />
              </a>. Data updated daily.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Last synced: {new Date(testMonitorData.lastUpdated).toLocaleDateString()} · Source:{" "}
              <a
                href="https://github.com/eth-act/zkevm-test-monitor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-link)] hover:underline inline-flex items-center gap-1"
              >
                github.com/eth-act/zkevm-test-monitor <ExternalLink className="w-3 h-3" />
              </a>
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-center py-3 px-4 font-semibold text-foreground">zkVM</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Commit</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">ISA Tests</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Last Run</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(testMonitorData.zkvms)
                    .filter(([, zkvm]) => zkvm.isRV64)
                    .map(([name, zkvm]) => (
                    <tr key={name} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 text-center">
                        <span className="font-semibold text-foreground">{zkvmDisplayNames[name] ?? name.toUpperCase()}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <code className="text-sm text-muted-foreground">{zkvm.commit}</code>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {zkvm.standard ? (
                          <span className={`text-sm font-medium ${zkvm.standard.passed === zkvm.standard.total ? 'text-green-600' : zkvm.standard.passed > 0 ? 'text-foreground' : 'text-red-500'}`}>
                            {zkvm.standard.passed}/{zkvm.standard.total}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-sm text-muted-foreground">
                          {zkvm.lastRun ? new Date(zkvm.lastRun).toLocaleDateString() : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Inclusion Criteria */}
          <section id="listing-criteria" className="mb-24">
            <h2 className="text-3xl font-bold mb-3 pl-4 border-l-[3px]" style={{ color: 'var(--accent-blue)', borderColor: 'var(--accent-orange)' }}>Inclusion Criteria</h2>
            <p className="text-muted-foreground mb-8">
              To be listed in the zkVM Readiness table, implementations must meet certain
              minimal criteria. Some of the expected criteria are listed below. The team
              evaluates, updates, and activates certain requirements as the project evolves.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-16 gap-y-12">
              {[
                {
                  title: "Open Source",
                  description: "All components relevant to proving Ethereum execution must be released under a permissive open-source license.",
                  active: true,
                },
                {
                  title: "ISA Compliance",
                  description: (
                    <>
                      The zkVM must be a 64-bit RISC-V machine. This is verified via our
                      compliance test suite. Eventually, full support for{" "}
                      <a
                        href="https://github.com/eth-act/zkvm-standards/tree/main/standards/riscv-target"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent-link)] hover:underline"
                      >
                        the standard target
                      </a>{" "}
                      will be required.
                    </>
                  ),
                  active: true,
                },
                {
                  title: "Real-Time Proving",
                  description: "The ability to generate a proof for a full Ethereum block within slot time. Criteria for timing targets will evolve (e.g., P99 latency requirements).",
                  active: false,
                },
                {
                  title: "Soundcalc Integration",
                  description: "Integration into the soundcalc framework for standardized verification and interoperability testing.",
                  active: false,
                },
              ].map((criterion) => (
                <div key={criterion.title}>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-2xl font-bold text-foreground">{criterion.title}</h3>
                    {criterion.active && (
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-semibold"
                        style={{ color: 'var(--accent-orange)' }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--accent-orange)' }}
                          aria-hidden="true"
                        />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{criterion.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* External Dashboards */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold mb-3 pl-4 border-l-[3px]" style={{ color: 'var(--accent-blue)', borderColor: 'var(--accent-orange)' }}>External Dashboards</h2>
            <p className="text-muted-foreground mb-6">
              Detailed tracking data is maintained on external dashboards managed by the team.
            </p>
            <div className="divide-y divide-border">
              <a
                href="https://eth-act.github.io/zkevm-benchmark-runs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-6 px-4 -mx-4 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-[var(--accent-orange)] transition-colors">zkEVM Benchmark Results</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cross-zkVM proving, execution, and verification benchmarks
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
              </a>
              <a
                href="https://eth-act.github.io/zkevm-test-monitor/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-6 px-4 -mx-4 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-[var(--accent-orange)] transition-colors">RISC-V Compliance Test Monitor</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nightly ISA compliance test results across all zkVM implementations.
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-4" />
              </a>
            </div>
          </section>
        </>
      )}

      {/* Ethereum Clients Tab */}
      {activeTab === "clients" && (
        <section>
          <p className="text-muted-foreground mb-8">
            Client teams working towards zkVM integration. High-level status of each client&apos;s
            readiness for ZK-based proving.
          </p>

          {/* Execution Layer */}
          <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent-blue)' }}>Execution Layer</h3>
          <div className="divide-y divide-border mb-12">
            {executionClients.map((client) => (
              <div key={client.name} className="py-6 px-4 -mx-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <ClientIcon name={client.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <h4 className="text-3xl font-bold text-foreground">{client.name}</h4>
                      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <a href={client.links.github} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[var(--accent-orange)] transition-colors inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5">
                          <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                        {client.links.website && (
                          <a href={client.links.website} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[var(--accent-orange)] transition-colors inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5">
                            <ExternalLink className="w-3.5 h-3.5" /> Website
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 mb-1 flex-wrap">
                      <ComplianceStatus status={client.specCompliance} />
                      <Badge variant="outline" className="text-sm">{client.language}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{client.description}</p>
                    <div className="flex sm:hidden items-center gap-2 mt-3">
                      <a href={client.links.github} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[var(--accent-orange)] transition-colors inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5">
                        <Github className="w-3.5 h-3.5" /> GitHub
                      </a>
                      {client.links.website && (
                        <a href={client.links.website} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[var(--accent-orange)] transition-colors inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5">
                          <ExternalLink className="w-3.5 h-3.5" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Consensus Layer */}
          <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--accent-blue)' }}>Consensus Layer</h3>
          <div className="divide-y divide-border">
            {consensusClients.map((client) => (
              <div key={client.name} className="py-6 px-4 -mx-4 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <ClientIcon name={client.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <h4 className="text-3xl font-bold text-foreground">{client.name}</h4>
                      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <a href={client.links.github} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[var(--accent-orange)] transition-colors inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5">
                          <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                        {client.links.website && (
                          <a href={client.links.website} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[var(--accent-orange)] transition-colors inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5">
                            <ExternalLink className="w-3.5 h-3.5" /> Website
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 mb-1 flex-wrap">
                      <ComplianceStatus status={client.specCompliance} />
                      <Badge variant="outline" className="text-sm">{client.language}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{client.description}</p>
                    <div className="flex sm:hidden items-center gap-2 mt-3">
                      <a href={client.links.github} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[var(--accent-orange)] transition-colors inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5">
                        <Github className="w-3.5 h-3.5" /> GitHub
                      </a>
                      {client.links.website && (
                        <a href={client.links.website} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-[var(--accent-orange)] transition-colors inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5">
                          <ExternalLink className="w-3.5 h-3.5" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
