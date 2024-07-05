import chalk from 'chalk'
import { name as MESSAGE_TITLE } from './package.json'

export function log(msg: string) {
  console.log(msg)
}

export function error(msg: string) {
  log(`${chalk.blueBright(MESSAGE_TITLE)} ${chalk.red(msg)}`)
}

export function info(msg: string) {
  log(`${chalk.blueBright(MESSAGE_TITLE)} ${chalk.blue(msg)}`)
}

export function warning(msg: string) {
  log(`${chalk.blueBright(MESSAGE_TITLE)} ${chalk.yellow(msg)}`)
}

export function success(msg: string) {
  log(`${chalk.blueBright(MESSAGE_TITLE)} ${chalk.green(msg)}`)
}
