import React, { useState, useCallback, useEffect } from 'react';
import Modal from './Modal';
import InputField from './InputField';
import Button from './Button';

interface ManualDSASyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (easy: number, medium: number, hard: number, todayCount: number) => void;
  initialEasy: number;
  initialMedium: number;
  initialHard: number;
  initialTodayProblems: number;
}

const ManualDSASyncModal: React.FC<ManualDSASyncModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEasy,
  initialMedium,
  initialHard,
  initialTodayProblems,
}) => {
  const [easy, setEasy] = useState(initialEasy);
  const [medium, setMedium] = useState(initialMedium);
  const [hard, setHard] = useState(initialHard);
  const [todayProblems, setTodayProblems] = useState(initialTodayProblems);

  useEffect(() => {
    if (isOpen) {
      setEasy(initialEasy);
      setMedium(initialMedium);
      setHard(initialHard);
      setTodayProblems(initialTodayProblems);
    }
  }, [isOpen, initialEasy, initialMedium, initialHard, initialTodayProblems]);

  const handleSave = useCallback(() => {
    onSave(easy, medium, hard, todayProblems);
  }, [easy, medium, hard, todayProblems, onSave]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manual DSA Sync">
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Manually update your total solved problems for Easy, Medium, and Hard.
          Also, set how many problems you solved today.
        </p>
        <InputField
          label="Total Easy Problems"
          type="number"
          value={easy}
          onChange={(e) => setEasy(parseInt(e.target.value) || 0)}
          min="0"
          className="mb-4"
        />
        <InputField
          label="Total Medium Problems"
          type="number"
          value={medium}
          onChange={(e) => setMedium(parseInt(e.target.value) || 0)}
          min="0"
          className="mb-4"
        />
        <InputField
          label="Total Hard Problems"
          type="number"
          value={hard}
          onChange={(e) => setHard(parseInt(e.target.value) || 0)}
          min="0"
          className="mb-4"
        />
        <InputField
          label="Problems Solved Today"
          type="number"
          value={todayProblems}
          onChange={(e) => setTodayProblems(parseInt(e.target.value) || 0)}
          min="0"
          className="mb-4"
        />
        <Button onClick={handleSave} className="w-full mt-4">
          Save Sync Data
        </Button>
      </div>
    </Modal>
  );
};

export default ManualDSASyncModal;