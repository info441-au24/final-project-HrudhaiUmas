# final-project-HrudhaiUmas
final-project-HrudhaiUmas created by GitHub Classroom


# retrieving or updating user info

import { useAuth } from "./AuthContext"

-- in the component...
const { user, setUser, checkAuth } = useAuth();

- user has the user info
- use setUser to update any information (like preferences)
- checkAuth() to check if user is logged in


# tutorial
1.
npm install

2.
to run the app in development mode,

npm run dev

to run it in production (what will be deployed),

npm run build
node ./bin/www