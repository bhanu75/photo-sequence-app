import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const Dropdown = ({ 
  label, 
  value, 
  options = [], 
  onSelect, 
  placeholder = 'Select...' 
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (option) => {
    onSelect(option.value);
    setVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, theme.typography.caption, { color: theme.colors.textSecondary }]}>
            {label}
          </Text>
        )}
        
        <TouchableOpacity
          style={[
            styles.trigger,
            { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.triggerText,
            { color: selectedOption ? theme.colors.textPrimary : theme.colors.textSecondary }
          ]}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <ChevronDown size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, theme.typography.sectionTitle]}>
                {label || 'Select Option'}
              </Text>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && { backgroundColor: theme.colors.muted }
                  ]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    { color: theme.colors.textPrimary }
                  ]}>
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Check size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  trigger: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  triggerText: {
    fontSize: 15,
    fontWeight: '400',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    borderRadius: 16,
    maxHeight: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  modalTitle: {
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '400',
  },
});

export default Dropdown;
