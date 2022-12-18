import React, {lazy, Suspense} from 'react'




const ReactJson = lazy(() => import('react-json-view'));


export function JsonView({data}) {

   return <Suspense fallback={<div>Page is Loading...</div>}>

        <div>
            {data && <ReactJson collapsed={false} theme={"bright:inverted"} src={data}/>}
            {/*{window && <JSONTree data={data} theme="bright" shouldExpandNode={shouldExpandNode} />}*/}
        </div>
 
    </Suspense>
}


 

export default JsonView;
  
  
