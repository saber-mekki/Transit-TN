import React from 'react';
import { TransportType } from '../../types';

interface VehicleIconProps extends React.SVGProps<SVGSVGElement> {
  type: TransportType;
}

export const BusIcon: React.FC<VehicleIconProps> = ({ type, ...props }) => {
    switch (type) {
        case TransportType.LOUAGE: // Car Icon
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
                    <path d="M18.58 5H5.42L3 12v8h2v-2h14v2h2v-8l-2.42-7zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 12 17.5 12s1.5.67 1.5 1.5S18.33 15 17.5 15zM5.81 10h12.38l1.04-3H4.77l1.04 3z"/>
                </svg>
            );
        case TransportType.TRANSPORTER: // Truck Icon
            return (
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2V9c0-.55-.45-1-1-1zm-6 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5.14 15c-.73 0-1.33-.55-1.4-1.26L3 9.87V6h10v9H5.14zM19 12h-4V6h3v6z"/>
                </svg>
            );
        case TransportType.BUS:
        default: // Bus Icon
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2V9c0-.55-.45-1-1-1zm-6 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-8-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm1-9h8v4H7V6z"/>
                </svg>
            );
    }
};
