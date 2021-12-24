module.exports = {
  apps: [
    {
      name: "graphql",
      env: {
        NO_PEER_DEPENDENCY_CHECK: true,
        PEER_DEPENDENCY_CHECK: true,
      },
      // start:
      //   "NO_PEER_DEPENDENCY_CHECK='true'  NO_PEER_DEPENDENCY_CHECK='1' ts-node  --transpile-only",
      script: " src/main.ts",
    },
    // {
    //   name: "queue",
    //   env: {
    //     NO_PEER_DEPENDENCY_CHECK: true,
    //     PEER_DEPENDENCY_CHECK: true,
    //   },
    //   script: "queue/fileprocessor.ts",
    // },
  ],
};
