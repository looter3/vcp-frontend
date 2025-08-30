#!/bin/bash

NAME=$1
DIR="src/components/$NAME"
FILE="$DIR/$NAME.tsx"

mkdir -p $DIR

cat > $FILE <<EOL
import React from 'react';

/*
type ${NAME}Props = {
  // define props here
};
*/

const $NAME: React.FC/*<${NAME}Props>*/ = (/*props*/) => {
  return (
    <div>
      <h1>$NAME Component</h1>
    </div>
  );
};

export default $NAME;
EOL

echo "✅ TypeScript component $NAME created at $FILE"