import * as React from 'react'

import { StyleSheet, View, Text, Button, Platform } from 'react-native'
import { callback, NitroModules } from 'react-native-nitro-modules'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColors } from '../useColors'
import {
  HybridTestObjectSwiftKotlin,
  RecyclableTestView,
  TestView,
} from 'react-native-nitro-test'
import { useIsFocused } from '@react-navigation/native'

const VIEWS_X = 15
const VIEWS_Y = 15

export function ViewScreenImpl() {
  const safeArea = useSafeAreaInsets()
  const colors = useColors()
  const [counter, setCounter] = React.useState(0)
  const [isUpdating, setIsUpdating] = React.useState(false)

  const views = React.useMemo(
    () =>
      [...Array(counter)].map((_, i) => {
        if (i % 3 === 0) {
          return (
            <TestView
              key={i}
              hybridRef={callback((ref) => {
                console.log(`Ref initialized!`)
                ref.someMethod()
                const isBlue = HybridTestObjectSwiftKotlin.getIsViewBlue(ref)
                console.log(`Is View blue: ${isBlue}`)
              })}
              style={styles.view}
              isBlue={i % 2 === 0}
              someCallback={callback(() => console.log(`Callback called!`))}
              colorScheme="dark"
              hasBeenCalled={false}
              onTouchEnd={() => {
                console.log(`Touched View #${i}!`)
              }}
            />
          )
        } else {
          return (
            <RecyclableTestView
              key={i}
              style={styles.view}
              isBlue={i % 2 === 0}
              onTouchEnd={() => {
                console.log(`Touched View #${i}!`)
              }}
            />
          )
        }
      }),
    [counter]
  )

  React.useEffect(() => {
    if (!isUpdating) return
    const i = setInterval(
      () => setCounter((c) => (c >= VIEWS_X * VIEWS_Y ? 0 : c + 1)),
      10
    )
    return () => clearInterval(i)
  }, [isUpdating])

  return (
    <View style={[styles.container, { paddingTop: safeArea.top }]}>
      <Text style={styles.header}>View</Text>

      {/*
        Two boxes, one style object. On iOS they are identical. On Android the
        TestView draws nothing: no fill, no rotation, no fade.

        Assert on `opacity` rather than `backgroundColor` - TestView paints its
        own surface, which masks whether the background arrived, but nothing
        native can override a view's alpha.
      */}
      <View style={styles.reproRow}>
        <View style={styles.reproCell}>
          <Text style={styles.reproLabel}>RN View</Text>
          <View style={styles.reproBox} />
        </View>
        <View style={styles.reproCell}>
          <Text style={styles.reproLabel}>TestView (Nitro)</Text>
          <TestView
            style={styles.reproBox}
            isBlue={false}
            hasBeenCalled={false}
            colorScheme="light"
          />
        </View>
      </View>
      <View style={styles.topControls}>
        <View style={styles.flex} />
        <Text style={styles.buildTypeText}>{NitroModules.buildType}</Text>
      </View>

      <View style={styles.resultContainer}>
        <View style={[styles.viewShadow]}>
          <View style={[styles.viewBorder, { borderColor: colors.foreground }]}>
            <View style={styles.viewContainer}>{views}</View>
          </View>
        </View>
      </View>

      <View style={[styles.bottomView, { backgroundColor: colors.background }]}>
        <Text style={styles.resultText} numberOfLines={2}>
          {isUpdating ? '🔄 Updating...' : '📱 Idle'}
        </Text>
        <View style={styles.flex} />
        <Button
          title={isUpdating ? 'Stop Updating' : 'Start Updating'}
          onPress={() => setIsUpdating((i) => !i)}
        />
      </View>
    </View>
  )
}

export function ViewScreen() {
  const isFocused = useIsFocused()
  return isFocused ? <ViewScreenImpl /> : null
}

const REPRO_BOX = {
  width: 120,
  height: 120,
  backgroundColor: '#00C000',
  transform: [{ rotate: '10deg' }],
  opacity: 0.4,
} as const

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 15,
    marginHorizontal: 15,
  },
  container: {
    flex: 1,
  },
  scrollContent: {},
  topControls: {
    marginHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildTypeText: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      macos: 'Menlo',
      android: 'monospace',
    }),
    fontWeight: 'bold',
  },
  segmentedControl: {
    minWidth: 180,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  viewShadow: {
    width: '80%',
    aspectRatio: 1,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },
  viewBorder: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 5,
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reproRow: { flexDirection: 'row', gap: 40, padding: 20, paddingTop: 30 },
  reproCell: { gap: 24 },
  reproLabel: { fontSize: 12, fontWeight: 'bold', color: '#888' },
  reproBox: REPRO_BOX,
  view: {
    width: `${100 / VIEWS_X}%`,
    height: `${100 / VIEWS_Y}%`,
    marginLeft: -0.0001,
  },
  testCase: {
    width: '100%',
    paddingHorizontal: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  testBox: {
    flexShrink: 1,
    flexDirection: 'column',
  },
  resultText: {
    flexShrink: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  testStatus: {
    fontSize: 14,
    flex: 1,
  },
  smallVSpacer: {
    height: 5,
  },
  largeVSpacer: {
    height: 25,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 45,
  },
  chartsContainer: {
    alignItems: 'stretch',
    width: '70%',
  },
  nitroResults: {},
  turboResults: {},
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  chart: {
    height: 20,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  flex: { flex: 1 },
  bottomView: {
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    elevation: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 7,
    shadowOpacity: 0.4,

    paddingHorizontal: 15,
    paddingVertical: 9,
    alignItems: 'center',
    flexDirection: 'row',
  },
})
