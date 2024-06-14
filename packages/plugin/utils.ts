import chalk from 'chalk'
import { name as MESSAGE_TITLE } from './package.json'

export const log = (msg: string) => {
  console.log(msg)
}

export const error = (msg: string) => {
  log(`${chalk.blueBright(MESSAGE_TITLE)} ${chalk.red(msg)}`)
}

export const info = (msg: string) => {
  log(`${chalk.blueBright(MESSAGE_TITLE)} ${chalk.blue(msg)}`)
}

export const warning = (msg: string) => {
  log(`${chalk.blueBright(MESSAGE_TITLE)} ${chalk.yellow(msg)}`)
}

export const success = (msg: string) => {
  log(`${chalk.blueBright(MESSAGE_TITLE)} ${chalk.green(msg)}`)
} 
