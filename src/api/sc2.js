import sc2 from 'sc2-sdk';
import { Constants } from 'expo';
import { sc2App } from 'constants/config';

// use bsteem-release-staging url
// exp://localhost:19000/+/redirect
// exp://exp.host/@jm90m/bsteem/+/redirect
// exp://exp.host/@jm90m/bsteem?release-channel=bsteem-release/+/redirect
const steemConnect = sc2.Initialize({
  app: sc2App,
  callbackURL: `${Constants.linkingUri}/redirect`,
});

export default steemConnect;
