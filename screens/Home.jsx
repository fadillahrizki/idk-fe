import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, withTheme } from '@rneui/themed';

const Buttons = ({navigation}) => {

    const loginOwner = () => {
        navigation.navigate('Dashboard', {
            role: 'Owner'
        })
    }

    const loginKasir = () => {
        navigation.navigate('Dashboard', {
            role: 'Kasir'
        })
    }

    return (
    <>
        <View style={styles.contentView}>
            <View style={styles.buttonsContainer}>
                <Button
                    title="Login Owner"
                    buttonStyle={{
                        backgroundColor: 'black',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                    }}
                    containerStyle={{
                        width: '100%',
                    }}
                    onPress={loginOwner}
                />
                <Button
                    title="Login Kasir"
                    buttonStyle={{
                        backgroundColor: 'black',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                    }}
                    containerStyle={{
                        width: '100%',
                    }}
                    onPress={loginKasir}
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