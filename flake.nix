# https://github.com/pimeys/nix-prisma-example/tree/main

{
  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    };

    flake-utils = {
      url = "github:numtide/flake-utils";
    };
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

      in
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
