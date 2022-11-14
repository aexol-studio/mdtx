/* eslint-disable */
import { NextConfig } from 'next'

type WithMDtx = (config: NextConfig) => NextConfig

interface NextMDtxOptions {
    /**
    * OUT path where MDtx file land.
    */
    out: string;
    /**
    * IN path where MDtx read .md files.
    */
    in: string;
    /**
    * markdownToHtml option, allow MDtx convert md content to html content.
    */
    markdownToHtml: boolean;
}


declare function pluginMDtx(options?: NextMDtxOptions): WithMDtx

export = pluginMDtx