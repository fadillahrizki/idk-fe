import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Dashboard from './screens/Dashboard';
import Uom from './screens/Uom';
import Product from './screens/Product';
import Transaction from './screens/Transaction';
import TransactionDetail from './screens/TransactionDetail';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Uom" component={Uom} />
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="Transaction" component={Transaction} />
        <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;