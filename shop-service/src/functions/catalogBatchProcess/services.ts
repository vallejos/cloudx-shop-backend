import fetch from 'node-fetch';

export const catalogBatchProcess = async (name: string, price: number, description?: string, count?: number) => {
  const url = 'https://cb5fun3bo4.execute-api.us-east-1.amazonaws.com/dev/products'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      price,
      count,
    }),
  }
  const response = await fetch(url, options);
  const json = await response.json();
  console.log(json);
}
