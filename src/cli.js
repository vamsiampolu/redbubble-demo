import program from 'commander'
import {isWebUri} from 'valid-url'
import path from 'path'
import fs from 'fs'
import isValidPath from 'is-valid-path'


function isUrl(url:string):boolean {
  if(isWebUri(url)) {
    return true
  }
  return false
}

/*
  First, check that its parent directory exists,
  if the parent directory exists, we know that we can either use the existing directory
  or create a new directory within the parent

  the last index of the path could be `/`, that would mean that the user has passed a directory as the arg but prefixed as the `/`
  that would still work with our code. so, no worries

  We need to validate if something is a  directory
  if it already exists, we need to be ok with it
  if the directory does not already exist, create it later
  if the directory exists and is not empty, ensure that we print a message
  asking if the user wants to overwrite the directory

  if no path is provided, we consider the parent to be the current directory
 */






function initializeCommander(defaults) {
  program
  .version('0.0.1')
  .usage('redbubble-demo')
  .option('-u','--url [url]',isUrl,defaults.url)
  .option('-o','--output-dir [path]',hasValidParentDirectory,path.resolve(defaults))
  .option('-s','--size [size]')
}
