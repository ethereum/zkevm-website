import { ZKEVMData, ClientInfo, MediaItem } from "@/lib/types";

// Only zkVMs that meet minimum criteria: RV64 + open source
// This is a curated list per the team's inclusion criteria
export const zkevmData: ZKEVMData[] = [
  {
    name: 'Jolt',
    description: 'A high-performance RISC-V ZKVM optimized for speed and developer experience.',
    architecture: 'rv64imac',
    testResults: { passed: 47, total: 47, percentage: 100 },
    status: 'In Development',
    securityTests: true,
    openSource: true,
    supportedClients: [],
    links: {
      github: 'https://github.com/a16z/jolt',
      docs: 'https://jolt.a16zcrypto.com/',
      license: 'https://github.com/a16z/jolt/blob/main/LICENSE',
    },
  },
  {
    name: 'Zisk',
    description: 'A 64-bit RISC-V ZKVM with atomic operations support for advanced smart contract functionality.',
    architecture: 'rv64ima',
    testResults: { passed: 82, total: 82, percentage: 100 },
    status: 'Testing',
    securityTests: true,
    openSource: true,
    supportedClients: [
      { name: 'Reth', color: 'bg-green-100 text-green-800', status: 'Production Ready' },
      { name: 'Ethrex', color: 'bg-green-100 text-green-800', status: 'Production Ready' }
    ],
    links: {
      github: 'https://github.com/0xPolygonHermez/zisk',
      docs: 'https://0xpolygonhermez.github.io/zisk/',
      license: 'https://github.com/0xPolygonHermez/zisk/blob/main/LICENSE',
    },
  },
];

// Full list of all tracked zkVMs (for reference / external dashboard links)
export const allZkvmData: ZKEVMData[] = [
  ...zkevmData,
  {
    name: 'Airbender',
    description: 'A RISC-V based zero-knowledge virtual machine designed for efficient proof generation.',
    architecture: 'rv32im',
    testResults: { passed: 46, total: 47, percentage: 97.9 },
    status: 'Testing',
    securityTests: false,
    openSource: true,
    supportedClients: [
      { name: 'Reth', color: 'bg-green-100 text-green-800', status: 'Production Ready' },
      { name: 'Ethrex', color: 'bg-green-100 text-green-800', status: 'Production Ready' }
    ],
    links: {
      github: 'https://github.com/matter-labs/zksync-airbender',
      docs: 'https://docs.zksync.io/zksync-protocol/zksync-airbender/overview',
    },
  },
  {
    name: 'OpenVM',
    description: 'An open-source RISC-V ZKVM implementation focused on modularity and extensibility.',
    architecture: 'rv32im',
    testResults: { passed: 47, total: 47, percentage: 100 },
    status: 'Testing',
    securityTests: true,
    openSource: true,
    supportedClients: [
      { name: 'Reth', color: 'bg-green-100 text-green-800', status: 'Production Ready' },
      { name: 'Ethrex', color: 'bg-green-100 text-green-800', status: 'Production Ready' }
    ],
    links: {
      github: 'https://github.com/openvm-org/openvm',
      docs: 'https://openvm.dev/',
    },
  },
  {
    name: 'RISC0',
    description: 'A production-ready RISC-V ZKVM with comprehensive tooling and developer ecosystem.',
    architecture: 'rv32im',
    testResults: { passed: 47, total: 47, percentage: 100 },
    status: 'Testing',
    securityTests: true,
    openSource: true,
    supportedClients: [
      { name: 'Reth', color: 'bg-green-100 text-green-800', status: 'Production Ready' },
      { name: 'Ethrex', color: 'bg-green-100 text-green-800', status: 'Production Ready' }
    ],
    links: {
      github: 'https://github.com/risc0/risc0',
      docs: 'https://dev.risczero.com/api',
    },
  },
];

// Simplified client info — high level, links to repos
export const clientData: ClientInfo[] = [
  // Execution Layer
  {
    name: 'Ethrex',
    type: 'execution',
    description: 'Lightweight Ethereum execution client written in Rust by Lambda Class.',
    language: 'Rust',
    links: { github: 'https://github.com/lambdaclass/ethrex', website: 'https://ethrex.xyz/' },
    specCompliance: 'compliant',
  },
  {
    name: 'Reth',
    type: 'execution',
    description: 'Modular, contributor-friendly Ethereum execution client written in Rust.',
    language: 'Rust',
    links: { github: 'https://github.com/paradigmxyz/reth', website: 'https://reth.rs' },
    specCompliance: 'compliant',
  },
  {
    name: 'Geth',
    type: 'execution',
    description: 'The original Ethereum execution client, written in Go.',
    language: 'Go',
    links: { github: 'https://github.com/ethereum/go-ethereum', website: 'https://geth.ethereum.org' },
    specCompliance: 'in-progress',
  },
  {
    name: 'Nethermind',
    type: 'execution',
    description: 'Enterprise-grade Ethereum execution client written in C#.',
    language: 'C#',
    links: { github: 'https://github.com/NethermindEth/nethermind', website: 'https://www.nethermind.io/nethermind-client' },
    specCompliance: 'in-progress',
  },
  {
    name: 'Besu',
    type: 'execution',
    description: 'Java-based Ethereum execution client designed for enterprise and public networks.',
    language: 'Java',
    links: { github: 'https://github.com/hyperledger/besu', website: 'https://besu.hyperledger.org' },
    specCompliance: 'not-started',
  },
  // Consensus Layer
  {
    name: 'Lighthouse',
    type: 'consensus',
    description: 'Ethereum consensus client written in Rust by Sigma Prime.',
    language: 'Rust',
    links: { github: 'https://github.com/sigp/lighthouse', website: 'https://lighthouse.sigmaprime.io' },
    specCompliance: 'in-progress',
  },
  {
    name: 'Teku',
    type: 'consensus',
    description: 'Java-based Ethereum consensus client by Consensys.',
    language: 'Java',
    links: { github: 'https://github.com/Consensys/teku', website: 'https://consensys.io/teku' },
    specCompliance: 'in-progress',
  },
  {
    name: 'Prysm',
    type: 'consensus',
    description: 'Go implementation of the Ethereum consensus protocol.',
    language: 'Go',
    links: { github: 'https://github.com/prysmaticlabs/prysm', website: 'https://prysmaticlabs.com' },
    specCompliance: 'in-progress',
  },
  {
    name: 'Nimbus',
    type: 'consensus',
    description: 'Lightweight Ethereum consensus client written in Nim.',
    language: 'Nim',
    links: { github: 'https://github.com/status-im/nimbus-eth2', website: 'https://nimbus.team' },
    specCompliance: 'not-started',
  },
  {
    name: 'Lodestar',
    type: 'consensus',
    description: 'TypeScript implementation of the Ethereum consensus client.',
    language: 'TypeScript',
    links: { github: 'https://github.com/ChainSafe/lodestar', website: 'https://lodestar.chainsafe.io' },
    specCompliance: 'not-started',
  },
];

// Media items — talks, videos, external blog posts
export const mediaData: MediaItem[] = [
  {
    title: 'zkEVM: Scaling Ethereum with Zero Knowledge Proofs',
    type: 'talk',
    url: 'https://www.youtube.com/watch?v=Z0Nad1wB_pY',
    date: '2026-03-01',
    description: 'An overview of the zkEVM team\'s work on scaling Ethereum L1 through zero-knowledge virtual machines.',
  },
  {
    title: 'zkEVM Talk',
    type: 'talk',
    url: 'https://www.youtube.com/watch?v=xPxH0dNlDUQ',
    date: '2026-03-01',
  },
  {
    title: 'Ethereum\'s Last Big Upgrade: The zkEVM | Ansgar Dietrichs',
    type: 'talk',
    url: 'https://www.youtube.com/watch?v=QK6yyRdJ-eY',
    date: '2026-02-23',
  },
];
