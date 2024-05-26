import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const BannerCarousel = ({ banners }) => {
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        showsPagination={true}
        height={200}
        width={width}
      >
        {banners.map((banner) => (
          <View key={banner.id} style={styles.slide}>
            <Image 
              source={{ uri: banner.image ? banner.image : banner.link }} 
              style={styles.image} 
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default BannerCarousel;
