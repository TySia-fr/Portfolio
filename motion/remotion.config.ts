import { Config } from "@remotion/cli/config";

Config.setEntryPoint("./src/index.ts");
// The logo's last frame must be bit-exact: render frames losslessly before encoding.
Config.setVideoImageFormat("png");
