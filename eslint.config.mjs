import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript].map((config) => {
	if (!config.rules) return config;
	return {
		...config,
		rules: {
			...config.rules,
			'react-hooks/purity': 'off',
		},
	};
});

export default eslintConfig;
