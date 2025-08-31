export function generateSignature({callback, paramsToSign}:{callback:any, paramsToSign:any}) {
  fetch(`/api/sign`, {
    method: "POST",
    body: JSON.stringify({
      paramsToSign,
    }),
  })
    .then((r) => r.json())
    .then(({ signature }) => {
      callback(signature);
    });
}
