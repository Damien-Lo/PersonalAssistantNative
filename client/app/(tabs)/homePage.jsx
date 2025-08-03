import {View, Text, StyleSheet} from 'react-native'

const app = () =>{
  return(
    <View style={styles.container}>
      <Text style={styles.text}>HomePage</Text>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    colour: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})