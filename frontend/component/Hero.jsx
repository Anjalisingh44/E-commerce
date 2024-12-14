import React, { useState } from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import RecentlyAdded from './RecentlyAdded';

const { Content } = Layout;

const Hero = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const breadcrumbItems = [{}];

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array of slider images
  const images = [
    "https://media.istockphoto.com/id/1347626309/photo/latina-female-using-desktop-computer-with-clothing-online-web-store-to-choose-and-buy-clothes.jpg?s=612x612&w=0&k=20&c=SGKPpmCvxMFYld_4MXuSUBFmAcHylKNp2kJgWuszmgw=",
    "https://media.istockphoto.com/id/598525768/photo/man-shopping-online.jpg?s=612x612&w=0&k=20&c=f43C5NEkTKriTnFmtr65m1h5-Ug0lYBcNERKCo2yuUI=",
    "https://media.istockphoto.com/id/1293177828/photo/laptop-set-up-for-online-shopping-at-xmas.jpg?s=612x612&w=0&k=20&c=TX0u3ke8XLrpOcCrZLhhjKyY_0OMhpoenaPIqf8r7L8=",
 
   
  ];

  // Function to handle next slide
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  // Function to handle previous slide
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5' }}>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '12px 0',
          }}
          items={breadcrumbItems}
        />
        <div
          style={{
            padding: 0,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Slider container */}
          <div
            style={{
              width: '100%',
              maxHeight: '550px',
              overflow: 'hidden',
              borderRadius: borderRadiusLG,
            }}
          >
            <img
              alt={`slider-${currentSlide}`}
              src={images[currentSlide]}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                transition: 'transform 0.5s ease-in-out',
              }}
            />
          </div>
          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,1)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
            }}
          >
            &#8249;
          </button>
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,1)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
            }}
          >
            &#8250;
          </button>
        </div>
      </Content>
      <div style={{ backgroundColor: '#F5F5F5', margin: '15px' }}>
        <span className="text-2xl text-black p-5 bg-slate-300">Recently Added product</span>
        <RecentlyAdded />
      </div>
    </div>
  );
};

export default Hero;
