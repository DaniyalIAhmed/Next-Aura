import Slider from "react-slick";
import Minicard from './Minicard';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const PropertyCarousel = ({ properties }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3, 
        },
      },
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  

  return (
    <div className="z-[2] rounded-md">
    <Slider {...settings} className="py-2 xl:px-5 z-[2]">
      {properties.length > 0 &&
        properties.map((property, index) => (
          <div key={index}>
            <Minicard
              title={property.Property_title}
              desc={property.Description}
              address={property.location}
              price={`$${parseFloat(property.price).toLocaleString()}`}
              location={property.location}
            />
          </div>
        ))}
    </Slider>
    </div>
  );
};

export default PropertyCarousel;
