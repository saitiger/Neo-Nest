import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TooltipContent {
  title: string;
  description: string;
  tips?: string[];
}

interface HelpTooltipProps {
  content: TooltipContent;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  children,
  placement = 'bottom',
}) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <>
      <TouchableOpacity onPress={showTooltip} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={hideTooltip}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={hideTooltip}>
          <View style={styles.modalContainer}>
            <TouchableOpacity activeOpacity={1} style={styles.tooltipContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>{content.title}</Text>
                <TouchableOpacity onPress={hideTooltip} style={styles.closeButton}>
                  <Icon name="close" size={20} color="#7f8c8d" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content}>
                <Text style={styles.description}>{content.description}</Text>
                
                {content.tips && content.tips.length > 0 && (
                  <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>Tips:</Text>
                    {content.tips.map((tip, index) => (
                      <View key={index} style={styles.tip}>
                        <Icon name="lightbulb-outline" size={16} color="#F39C12" />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width - 40,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  tooltipContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 300,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  description: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
});

export default HelpTooltip;