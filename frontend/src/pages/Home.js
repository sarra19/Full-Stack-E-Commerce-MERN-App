import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>
      
      <HorizontalCardProduct category={"face"} heading={"Top's Face"}/>
      <HorizontalCardProduct category={"gift sets"} heading={"Popular's Gift Sets"}/>

      <VerticalCardProduct category={"cheeks"} heading={"Cheeks"}/>
      <VerticalCardProduct category={"Nails"} heading={"Nails"}/>
      <VerticalCardProduct category={"makeup removers"} heading={"Makeup Removers"}/>
      <VerticalCardProduct category={"eyes"} heading={"Eyes"}/>
      <VerticalCardProduct category={"lips"} heading={"Lips"}/>
      <VerticalCardProduct category={"fragrance"} heading={"Fragrance"}/>
      <VerticalCardProduct category={"skincare"} heading={"Skincare"}/>
      <VerticalCardProduct category={"body care"} heading={"Body Care"}/>
    </div>
  )
}

export default Home