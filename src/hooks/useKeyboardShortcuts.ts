import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onStopAll: () => void;
  onToggleSound: (soundId: string) => void;
  onMasterVolumeUp: () => void;
  onMasterVolumeDown: () => void;
}

export const useKeyboardShortcuts = ({
  onStopAll,
  onToggleSound,
  onMasterVolumeUp,
  onMasterVolumeDown
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Prevent default behavior for our shortcuts
      const shortcuts = ['Escape', 'Space', 'ArrowUp', 'ArrowDown', '1', '2', '3', '4', '5', '6', '7', '8'];
      if (shortcuts.includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'Escape':
          onStopAll();
          break;
        case 'Space':
          // Toggle first sound as default
          onToggleSound('rain');
          break;
        case 'ArrowUp':
          onMasterVolumeUp();
          break;
        case 'ArrowDown':
          onMasterVolumeDown();
          break;
        case 'Digit1':
          onToggleSound('rain');
          break;
        case 'Digit2':
          onToggleSound('ocean');
          break;
        case 'Digit3':
          onToggleSound('coffee');
          break;
        case 'Digit4':
          onToggleSound('forest');
          break;
        case 'Digit5':
          onToggleSound('thunder');
          break;
        case 'Digit6':
          onToggleSound('wind');
          break;
        case 'Digit7':
          onToggleSound('birds');
          break;
        case 'Digit8':
          onToggleSound('fire');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onStopAll, onToggleSound, onMasterVolumeUp, onMasterVolumeDown]);
};
