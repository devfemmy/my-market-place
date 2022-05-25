import React from 'react';
import {View, Pressable, StyleSheet, Image} from 'react-native';
import { globalTheme } from '../../utils/themes';
import {hp, wp} from '../../utils/helpers';
import {Text} from '../common';
import {checkbox} from "../../assets/index"
import { globalStyles } from "../../styles/globalStyles"

type IProp = {
  header: string;
  title: string;
  type: string;
  selected: string;
  handleClick?: () => void;
};


const WelcomeCard: React.FC<IProp> = ({
  header,
  title,
  selected,
  type,
  handleClick,
}) => {
  return (
    <Pressable onPress={handleClick}>
      <View style={selected === type ? styles.selected : styles. welcomeContainer}>
        <View style={[styles.cardView, globalStyles.rowBetweenNoCenter]}>
          <Text text={header} fontSize={20} />
          <View style={selected !== type && styles.checkbox}>
            {selected === type && (
              <Image
                source={checkbox}
                style={styles.image}
              />
            )}
          </View>
        </View>
        <Text text={title} fontSize={18} style={styles.title} />
      </View>
    </Pressable>
  );
};

export default WelcomeCard;

const styles = StyleSheet.create({
  welcomeContainer: {
    padding: 10,
    // borderWidth: 1,
    borderColor: globalTheme.gray,
    borderRadius: 10,
    marginVertical: 10,
    height: hp(150),
    backgroundColor: globalTheme.darkBlack,
  },
  image: {
    width: 20,
    height: 20,
  },
  selected: {
    borderColor: globalTheme.bazaraTint,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    height: hp(150),
    backgroundColor: globalTheme.darkBlack,
  },
  cardView: {
    marginTop: 10,
  },
  title: {
    color: globalTheme.gray,
    width: wp(284),
  },
  checkbox: {
    backgroundColor: globalTheme.black,
    borderWidth: 1,
    borderColor: globalTheme.gray,
    width: 20,
    height: 20,
    borderRadius: 50,
  },
});
