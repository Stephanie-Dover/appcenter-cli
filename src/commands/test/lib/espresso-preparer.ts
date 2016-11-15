import { IFileDescriptionJson } from "./test-manifest-reader";
import { out } from "../../../util/interaction";
import * as _ from "lodash";
import * as fs from "fs";
import * as path from "path";
import * as glob from "glob";
import * as pfs from "../../../util/misc/promisfied-fs";

export class EspressoPreparer {
  private readonly artifactsDir: string;
  private buildDir: string;
  private projectDir: string;
  public include: IFileDescriptionJson[];
  public testParameters: { [key:string]: any };

  constructor(artifactsDir: string, projectDir?: string, buildDir?: string) {
    if (!artifactsDir) {
      throw new Error("Argument artifactsDir is required");
    }

    this.projectDir = projectDir;
    this.buildDir = buildDir;
    this.artifactsDir = artifactsDir;

    this.validateEitherProjectOrBuildDir();
  }

  private validateEitherProjectOrBuildDir() {
    if ((this.projectDir && this.buildDir) || !(this.projectDir || this.buildDir)) {
      throw new Error("Either projectDir or buildDir must be specified");
    }
  }

  public async prepare(): Promise<string> {
    if (this.projectDir) {
      await this.validateProjectDir();
      this.buildDir = await this.generateBuildDirFromProject();
    }

    this.validateBuildDir();

    await pfs.copyDir(this.buildDir, this.artifactsDir);

    let manifestPath = path.join(this.artifactsDir, "test-manifest.json");
    let manifest = await this.createEspressoManifest();
    let manifestJson = JSON.stringify(manifest, null, 1);
    await pfs.writeFile(manifestPath, manifestJson);

    return manifestPath;
  }

  private async validateProjectDir() {
    await this.validatePathExists(
      this.projectDir, 
      false, 
      `Project directory ${this.projectDir} doesn't exist`);
  }

  private async generateBuildDirFromProject(): Promise<string> {
    throw new Error("Not implemented");
  }

  private async validateBuildDir() {
    await this.validateBuildDirExists();    
    await this.validateTestApkExists();
  }

  private async globAsync(pattern: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      glob(pattern, (err, matches) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(matches);
        }
      });
    });
  }

  private async validateBuildDirExists() {
    await this.validatePathExists(
      this.buildDir,
      false,
      `Espresso build directory "${this.buildDir}" doesn't exist`);
  }

  private async validateTestApkExists(): Promise<void> {
    await this.testApkPath();      
  }

  private async testApkPath(): Promise<string> {
    let apkPattern = path.join(this.buildDir,"*androidTest.apk");
    let files = await this.globAsync(apkPattern);
    
    if (files.length === 0) {
       throw new Error(`An apk with name matching "*androidTest.apk" was not found inside directory inside build directory "${this.buildDir}"`);
    }
    else if (files.length >= 2) {
       throw new Error(`Multiple apks with name matching "*androidTest.apk" was found inside directory inside build directory "${this.buildDir}". A unique match is required.`);
    }
    else {
      let apkPath = files[files.length - 1];
      return apkPath;
    }
  }

  private async validatePathExists(path: string, isFile: boolean, errorMessage: string): Promise<void> {
    let stats: fs.Stats = null;
    
    try {
      stats = await pfs.stat(path);
    }
    catch (err) {
      throw new Error(errorMessage);
    }

    if (isFile !== stats.isFile()) {
      throw new Error(errorMessage);
    }
  }

  private async createEspressoManifest(): Promise<any> {
    let apkFullPath = await this.testApkPath();
    let apkArtifactsPath = path.basename(apkFullPath); 
    let result = {
      "schemaVersion": "1.0.0",
      "files": [apkArtifactsPath],
      "testFramework": {
        "name": "espresso",
        "data": { }
      }
    };

    if (this.include) {
      for (let i = 0; i < this.include.length; i++) {
        
        let includedFile = this.include[i];
        let targetPath = path.join(this.artifactsDir, includedFile.targetPath);
        await pfs.copy(includedFile.sourcePath, targetPath);
        result.files.push(includedFile.targetPath);
      }
    }

    _.merge(result.testFramework.data, this.testParameters || {}); 

    return result;
  }
}