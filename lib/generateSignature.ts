export function generateSignature({ callback, paramsToSign }: { callback: any, paramsToSign: any }) {
  fetch(`/api/sign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      paramsToSign
    }),
  })
    .then((r) => r.json())
    .then(({ signature }) => {
      callback(signature);
    });
}
