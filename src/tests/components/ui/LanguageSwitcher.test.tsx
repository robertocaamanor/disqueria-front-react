import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';

// Mock react-i18next
const changeLanguageMock = vi.fn();
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: {
            language: 'es',
            changeLanguage: changeLanguageMock,
        },
    }),
}));

describe('LanguageSwitcher', () => {
    it('renders current language', () => {
        render(<LanguageSwitcher />);
        expect(screen.getByText('es')).toBeInTheDocument();
    });

    it('calls changeLanguage on click', () => {
        render(<LanguageSwitcher />);
        fireEvent.click(screen.getByRole('button'));
        expect(changeLanguageMock).toHaveBeenCalledWith('en');
    });
});
