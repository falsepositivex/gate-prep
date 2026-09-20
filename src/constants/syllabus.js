// Official GATE 2027 CS/IT Syllabus
export const SYLLABUS = [
  { id: "ga", name: "General Aptitude", topics: [
    "Verbal Aptitude — Grammar, Vocabulary, Reading Comprehension",
    "Quantitative Aptitude — Data Interpretation, Numerical Computation & Estimation",
    "Analytical Aptitude — Logic, Deduction, Induction, Analogy, Reasoning",
    "Spatial Aptitude — Transformations & Patterns (2D/3D)"
  ]},
  { id: "dm", name: "Discrete Mathematics", topics: [
    "Propositional and First-Order Logic",
    "Sets, Relations, Functions, Partial Orders and Lattices",
    "Monoids, Groups",
    "Graphs: Connectivity, Matching, Coloring",
    "Combinatorics: Counting, Recurrence Relations, Generating Functions"
  ]},
  { id: "la", name: "Linear Algebra", topics: [
    "Matrices",
    "Determinants",
    "System of Linear Equations",
    "Eigenvalues and Eigenvectors",
    "LU Decomposition"
  ]},
  { id: "calc", name: "Calculus", topics: [
    "Limits, Continuity and Differentiability",
    "Maxima and Minima",
    "Mean Value Theorem",
    "Integration"
  ]},
  { id: "ps", name: "Probability & Statistics", topics: [
    "Random Variables",
    "Uniform, Normal, Exponential, Poisson and Binomial Distributions",
    "Mean, Median, Mode and Standard Deviation",
    "Conditional Probability and Bayes Theorem"
  ]},
  { id: "dld", name: "Digital Logic", topics: [
    "Boolean Algebra and Minimization (Algebraic, K-Map, Tabular)",
    "Combinational and Sequential Circuits",
    "Number Representations and Computer Arithmetic (Fixed & Floating Point)"
  ]},
  { id: "coa", name: "Computer Organization & Architecture", topics: [
    "Instruction Set and Addressing Modes",
    "Design of Arithmetic and Logic Unit (ALU)",
    "Design of Control Unit — Hardwired and Microprogrammed",
    "I/O Interface (Interrupt and DMA Mode)",
    "Instruction Pipelining",
    "Pipeline Hazards"
  ]},
  { id: "cprog", name: "C Programming", topics: [
    "Programming in C — syntax, functions, pointers, structures",
    "Recursion"
  ]},
  { id: "ds", name: "Data Structures", topics: [
    "Arrays, Stacks, Queues",
    "Linked Lists, Trees, Binary Search Trees, Binary Heaps",
    "Graphs (as a data structure)"
  ]},
  { id: "algo", name: "Algorithms", topics: [
    "Searching, Sorting, Hashing",
    "Asymptotic Worst Case Time and Space Complexity",
    "Design Techniques: Greedy, Dynamic Programming, Divide-and-Conquer",
    "Graph Traversals",
    "Minimum Spanning Trees",
    "Shortest Paths"
  ]},
  { id: "toc", name: "Theory of Computation", topics: [
    "Regular Expressions and Finite Automata",
    "Context-Free Grammar and Push-Down Automata",
    "Regular and Context-Free Languages",
    "Pumping Lemma",
    "Turing Machines and Undecidability"
  ]},
  { id: "cd", name: "Compiler Design", topics: [
    "Lexical Analysis",
    "Parsing",
    "Syntax-Directed Translation",
    "Runtime Environments",
    "Intermediate Code Generation",
    "Local Optimization",
    "Data Flow Analysis: Constant Propagation, Liveness, Common Subexpr. Elimination"
  ]},
  { id: "os", name: "Operating System", topics: [
    "System Calls, Processes, Threads",
    "Inter-Process Communication, Concurrency and Synchronization",
    "Deadlock",
    "CPU and I/O Scheduling",
    "Memory Management and Virtual Memory",
    "File Systems"
  ]},
  { id: "db", name: "Databases", topics: [
    "ER-Model",
    "Relational Model: Relational Algebra, Tuple Calculus and SQL",
    "Integrity Constraints",
    "Normal Forms",
    "File Organization",
    "Indexing (B and B+ Trees)",
    "Transactions and Concurrency Control"
  ]},
  { id: "cn", name: "Computer Networks", topics: [
    "Concept of Layering: OSI and TCP/IP Protocol Stacks",
    "Switching: Circuit, Packet, Virtual Circuit & Performance Metrics",
    "Data Link Layer: Error Detection, Medium Access Control, Ethernet",
    "Routing: Distance Vector and Link State Routing",
    "IPv4: Fragmentation, CIDR Notation, NAT",
    "Transport Layer: Flow Control, Congestion Control, TCP, Socket API",
    "Application Layer: DNS and HTTP"
  ]}
];

export const STAGES = [
  { k: "L", label: "Lecture" },
  { k: "D", label: "DPP" },
  { k: "P", label: "PYQ" },
  { k: "R", label: "Revision" }
];
