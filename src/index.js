import "./index.scss"

import { InspectorControls, ColorPalette, BlockControls, AlignmentToolbar} from '@wordpress/block-editor'
import { PanelBody,
         SelectControl,
         TextControl,
         } from '@wordpress/components';

wp.blocks.registerBlockType("ybc/yoojeenblock", {
  title: "Posts from Category",
  icon: "welcome-learn-more",
  category: "common",
  attributes: {
    blockTitle: {type: 'string', default: 'Default title'},
    postData: {type: 'array'},
    currentCat: {type: 'string', default: null},
    titleColor: {type: 'string', default: '#4d4d4d'},
    blockBg: {type: 'string', default: '#b8c9f8'},
    titleSize: {type: 'string', default: '18'},
    loadingStyle: {type: 'number', default: 0},
    theAlignment: {type: 'string', default: 'left'}
  },
  description: "Displays several posts from choosen category (if exists). Choose category in dropdown list below",
  example: {
    attributes: {
      blockTitle: 'Block Header',
      postData: [{post_title: 'Some post from category', post_url: ''}, {post_title: 'Another post from category', post_url: ''}],
      currentCat: '',
      titleColor: '#4d4d4d',
      blockBg: '#b8c9f8',
      titleSize: '18',
      loadingStyle: 0,
      theAlignment: 'left'
    }
  },
  edit: EditComponent,
  save: function () {
    return null
  }
})

function EditComponent({attributes, setAttributes}) {
  function changeBlockTitle(newValue){
    setAttributes({blockTitle: newValue})
  }
  function changeTitleColor(newValue){
    setAttributes({titleColor: newValue})
  }
  function changeTitleSize(newValue){
    setAttributes({titleSize: newValue})
  }
  function changeBlockBg(newValue){
    setAttributes({blockBg: newValue})
  }
  function changePreloader(){
    setAttributes({loadingStyle: 1})
  }
  function getPosts(cat_id){
    if(cat_id == 0) return;
    setAttributes({currentCat: cat_id})
    /* loading style */
    changePreloader();
    fetch(`http://wptest/wp-json/ybc/v1/my-route/${cat_id}`)
    .then(response => {
      if (!response.ok) {
          throw new Error(response.statusText);
      }
      return response;
  })
  .then(response => response.json())
  .then(data => { setAttributes({postData: [...data], loadingStyle: 0}) })
  }

  let catsArr = []
  let sel = '';
  if((typeof catinfo !== undefined) && catinfo.length){
    catsArr.push({label: 'Select category', value: 0}) 
    catinfo.map(function(obj, index){
      if(obj.cat_id == attributes.currentCat) sel = 'selected'
      catsArr.push({label: obj.cat_name, value: obj.cat_id, selected: sel});
    })
  }
  const {blockTitle,
    postData,
    currentCat,
    titleColor,
    blockBg,
    titleSize,
    loadingStyle,
    theAlignment
  } = attributes
  console.log(postData);
  return ([
    <BlockControls>
      <AlignmentToolbar value={theAlignment} onChange={val => setAttributes({theAlignment: val})} />
    </BlockControls>,
    <InspectorControls>
      <PanelBody>
        <h5>{(catsArr !== undefined && catsArr.length) ? "List of Categories" : "There is no categories yet"}</h5>
        <SelectControl
          label=""
          value={currentCat}
          options={catsArr}
          onChange={(cat_id) => { getPosts(cat_id) }}
        />
      </PanelBody>
      <PanelBody>
        <TextControl
							label="Change block Title"
							help=""
							value={ blockTitle}
              placeholder={blockTitle.default}
							onChange={ changeBlockTitle }
        />
      </PanelBody>
      <PanelBody>
        <TextControl
							label="Change Title Font Size"
							help=""
							value={ titleSize }
              placeholder={titleSize.default}
							onChange={ changeTitleSize }
        />
      </PanelBody>
      
      <PanelBody>
        <p><strong>Select title color:</strong></p>
        <ColorPalette value={titleColor} onChange={changeTitleColor} />
      </PanelBody>
      <PanelBody>
        <p><strong>Select block background:</strong></p>
        <ColorPalette value={blockBg} onChange={changeBlockBg} />
      </PanelBody>
    </InspectorControls>,
    <div className="block_container" style={{backgroundColor: blockBg, textAlign: theAlignment}}>
      <h4 style={{color: titleColor, fontSize: `${titleSize}px`}}>{blockTitle} </h4>
      <div className="results">
      {(postData == undefined || !postData.length) ? <h6>Choose category...</h6> : postData.map(function(postArr){
        return <h6>{postArr['post_title']}</h6>
      })}
      <div className="loading" style={{backgroundColor: blockBg, opacity: loadingStyle}}>Loading...</div>
      </div>
    </div>
  ])
}
