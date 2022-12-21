import { AzureFunction } from '@azure/functions';

const httpTrigger: AzureFunction = async (_, req) => {
  console.log(req.params);
  return {
    res: {
      body: { test: '' },
    },
  };
};

export default httpTrigger;
