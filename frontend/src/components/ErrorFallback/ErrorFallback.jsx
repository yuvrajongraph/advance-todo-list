/* eslint-disable react/prop-types */

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <>
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary} style={{backgroundColor:"gray"}}>Try again</button>
    </div>
    </>
  )
}

export default ErrorFallback 