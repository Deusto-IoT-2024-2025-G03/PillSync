# https://github.com/VanCoding/nix-prisma-utils
# https://github.com/pimeys/nix-prisma-example/tree/main

{
  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    };

    flake-utils = {
      url = "github:numtide/flake-utils";
    };

    prisma-utils = {
      url = "github:VanCoding/nix-prisma-utils";
    };
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      # prisma-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # prisma = (prisma-utils.lib.prisma-factory {
        #     nixpkgs = import nixpkgs { inherit system; };

      in
      #     prisma-fmt-hash = "sha256-1E0RSlpFrY4UroZjOug8tr28sV+1TUgts4508hm9WDQ=";
      #     query-engine-hash = "sha256-ABmemJAwf2fM/2UkvFm56CJ29YBo7grAFFRs1R2O5qY=";
      #     libquery-engine-hash = "sha256-S4byVCgcb7aT0yxuK+jiYu+FeJTPbUJeOeLJdUpCCeU=";
      #     schema-engine-hash = "sha256-Fbi7bOjoN9uNnb7bF3CSVrHlIqrQHvXO70jZslVe4K0=";
      # }).fromPnpmLock ./pnpm-lock.yaml;
      with pkgs;
      {
        devShells = {
          default = mkShell {
            nativeBuildInputs = [ bashInteractive ];
            buildInputs = with nodePackages_latest; [
              biome
              nest-cli
              nodejs
              openssl
              pnpm
              prisma
              turbo-unwrapped
              typescript
              virtualenv
            ];

            # inherit (prisma) shellHook;

            shellHook = ''
              export PATH="./node_modules/bin:$PATH"
            '';

            env = {
              PRISMA_SCHEMA_ENGINE_BINARY = "${prisma-engines}/bin/schema-engine";
              PRISMA_QUERY_ENGINE_BINARY = "${prisma-engines}/bin/query-engine";
              PRISMA_QUERY_ENGINE_LIBRARY = "${prisma-engines}/lib/libquery_engine.node";
              PRISMA_FMT_BINARY = "${prisma-engines}/bin/prisma-fmt";
              PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = 1;
            };
          };
        };
      }
    );
}
