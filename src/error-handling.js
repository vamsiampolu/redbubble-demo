import { error } from './colors'

export const handleError = (e) => {
  let code
  if (e.code) {
    code = e.code
  }
  const printCode = `CODE: ${code}`
  console.error(error(`Failed with error
      ${code ? printCode : ''}
      MESSAGE: ${e.message}
      😥 Aborting process. Bye

      x------THE END --------x
    `))
  process.exit(1)
}

export const handleRejection = (reason, promise) => {
  console.error(error(
    `
      Failed to perform asynchronous action.
      REASON: ${reason}
      😥 Aborting process. Bye

        x------THE END --------x
    `
  )

  )
  process.exit(1)
}

export const handleUncaughtExceptions = () => {
  process.on('uncaughtException', handleError)
}

export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', handleRejection)
}
