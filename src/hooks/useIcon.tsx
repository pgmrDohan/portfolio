import { icons, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react'

export const useIcon = (icon: string) => {
    const Icon = (icons as { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> })[icon];
    return Icon;
}