import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { User, ArrowRight } from 'lucide-react';

const FirstTimeSetupModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Close modal with Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleCompleteProfile = () => {
    onClose();
    navigate('/profile', { state: { editMode: true } });
  };

  const handleSkipForNow = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div 
          className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-4 rounded-full">
                <User size={32} className="text-black" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-black mb-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Welcome to La Patisserie!
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              Complete your profile for enhanced experience
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCompleteProfile}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md transition-colors shadow-md flex items-center justify-center space-x-2"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                <span>Complete Profile</span>
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={handleSkipForNow}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FirstTimeSetupModal;