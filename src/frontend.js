import "./frontend.scss"
import React, { useState } from "react"
import ReactDOM from "react-dom"

const divsToUpdate = document.querySelectorAll(".boilerplate-update-me")

divsToUpdate.forEach(div => {
  const data = JSON.parse(div.querySelector("pre").innerText)
  ReactDOM.render(<OurComponent {...data} />, div)
  div.classList.remove("boilerplate-update-me")
})

function OurComponent(props) {
  console.log(props);
  const {postData, blockTitle, titleColor, blockBg, titleSize, theAlignment} = props
  let output;
  if(postData == undefined){
    output = 'No posts yet...'; 
  }else{
    if(postData.length){
      output = postData.map(function(postArr){
        return <h6><a href={postArr['post_url']}>{postArr['post_title']}</a></h6>
      })
      }else{
        output = 'No posts yet...'; 
    }
  }
  
  return (
      <div className="yoojeen-block" style={{backgroundColor: blockBg, textAlign: theAlignment}}>
        <h4 style={{color: titleColor, fontSize: `${titleSize}px`}}>{blockTitle ? blockTitle : 'Default title'}</h4>
        {output}
      </div>
  )
}
