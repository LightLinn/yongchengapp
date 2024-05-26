import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Icon, Card } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { fetchVenues } from '../../../api/venueApi'; // 假设从单独的 API 文件中导入 fetchVenues

const VenueScreen = () => {
  const [venues, setVenues] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const fetchedVenues = await fetchVenues();
        setVenues(fetchedVenues);
      } catch (error) {
        console.error('Failed to load venues', error);
        setVenues([
          {
            id: 1,
            name: "游泳池A",
            description: "25米標準游泳池，適合日常訓練和比賽。",
            capacity: 50,
            weekday_open: "06:00",
            weekday_close: "22:00",
            weekend_open: "08:00",
            weekend_close: "20:00",
            longitude: 121.473701,
            latitude: 31.230416,
            address: "上海市浦東新區陸家嘴環路",
            manager: "張三"
          },
          {
            id: 2,
            name: "羽毛球館B",
            description: "10個標準羽毛球場，提供專業教練指導。",
            capacity: 100,
            weekday_open: "07:00",
            weekday_close: "23:00",
            weekend_open: "09:00",
            weekend_close: "21:00",
            longitude: 114.305393,
            latitude: 30.592850,
            address: "湖北省武漢市江岸區解放大道",
            manager: "李四"
          },
          {
            id: 3,
            name: "足球場C",
            description: "11人制足球場，草坪質量優良，配有夜間照明。",
            capacity: 200,
            weekday_open: "05:30",
            weekday_close: "21:30",
            weekend_open: "06:30",
            weekend_close: "20:30",
            longitude: 116.407396,
            latitude: 39.904200,
            address: "北京市朝陽區北四環東路",
            manager: "王五"
          },
          {
            id: 4,
            name: "籃球場D",
            description: "室內籃球場，配有空調和觀眾席。",
            capacity: 150,
            weekday_open: "06:00",
            weekday_close: "22:30",
            weekend_open: "07:00",
            weekend_close: "21:00",
            longitude: 113.264385,
            latitude: 23.129112,
            address: "廣東省廣州市天河區體育東路",
            manager: "趙六"
          },
          {
            id: 5,
            name: "網球場E",
            description: "6個標準網球場，配有專業燈光和更衣室。",
            capacity: 60,
            weekday_open: "05:00",
            weekday_close: "23:00",
            weekend_open: "06:00",
            weekend_close: "22:00",
            longitude: 120.155070,
            latitude: 30.274085,
            address: "浙江省杭州市西湖區玉皇山路",
            manager: "錢七"
          }
        ]);
      }
    };

    loadVenues();
  }, []);

  const renderItem = ({ item }) => (
    <Card>
      <Card.Title>{item.name}</Card.Title>
      <Card.Divider />
      <Text>描述: {item.description}</Text>
      <Text>人數容量: {item.capacity}</Text>
      <Text>平日開放時間: {item.weekday_open}</Text>
      <Text>平日關閉時間: {item.weekday_close}</Text>
      <Text>假日開放時間: {item.weekend_open}</Text>
      <Text>假日關閉時間: {item.weekend_close}</Text>
      <Text>經度: {item.longitude}</Text>
      <Text>緯度: {item.latitude}</Text>
      <Text>地址: {item.address}</Text>
      <Text>管理者: {item.manager}</Text>
      <Button
        title="查看詳情"
        onPress={() => router.push(`/screens/venue/detail/${item.id}`)}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={venues}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/screens/venue/VenueAddScreen')}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2089dc',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default VenueScreen;
