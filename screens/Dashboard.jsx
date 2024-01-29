import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, withTheme } from '@rneui/themed';

const Buttons = ({route, navigation}) => {

    const {role} = route.params;

    const handleUom = () => {
        navigation.navigate('Uom')
    }

    const handleProduct = () => {
        navigation.navigate('Product')
    }

    const handleTransaction = () => {
        navigation.navigate('Transaction')
    }

    return (
    <>
        <View style={styles.contentView}>
            <View style={styles.buttonsContainer}>
                {
                  role == "Owner" ?  <Button
                      title="Management Uom"
                      buttonStyle={{
                          backgroundColor: 'black',
                          borderWidth: 2,
                          borderColor: 'white',
                          borderRadius: 30,
                      }}
                      containerStyle={{
                          width: '100%',
                      }}
                      onPress={handleUom}
                  /> : ''
                }

                {
                  role == "Owner" ?  <Button
                    title="Management Product"
                    buttonStyle={{
                        backgroundColor: 'black',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                    }}
                    containerStyle={{
                        width: '100%',
                    }}
                    onPress={handleProduct}
                /> : ''
                }
                
                
                <Button
                    title="Management Transaction"
                    buttonStyle={{
                        backgroundColor: 'black',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                    }}
                    containerStyle={{
                        width: '100%',
                    }}
                    onPress={handleTransaction}
                />
                
            </View>
        </View>
    </>
    );
};

const styles = StyleSheet.create({
contentView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
},
buttonsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: 12,
  paddingHorizontal: 24
},
});

export default withTheme(Buttons, '');