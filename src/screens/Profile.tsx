import * as React from 'react';
import { Button, Text } from 'react-native';

export const Profile = ({ route }) => {
    return <Text>This is {route.params.name}'s profile</Text>;
};