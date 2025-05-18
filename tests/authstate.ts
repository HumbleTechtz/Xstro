import useSqliteAuthState from '../src/utils/useSqliteAuthState.ts';

(async () => {
	console.log('🚀 Starting Advanced useSqliteAuthState Tests...\n');

	const { state, saveCreds } = await useSqliteAuthState();

	const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

	const sampleKeys = {
		session: {
			alice: {
				id: 'alice',
				session: 'session-data-alice',
				timestamp: Date.now(),
			},
			bob: { id: 'bob', session: 'session-data-bob', timestamp: Date.now() },
		},
		'pre-key': {
			alice: { id: 'alice', preKey: 'pre-key-alice', valid: true },
			charlie: { id: 'charlie', preKey: 'pre-key-charlie', valid: false },
		},
		'app-state-sync-key': {
			'sync-1': {
				keyData: 'abc123',
				fingerprint: 999,
			},
		},
	};

	console.log('🧪 [1] Setting initial keys...');
	await state.keys.set(sampleKeys);
	console.log('✅ Keys written.\n');

	await delay(100);

	console.log('📦 [2] Retrieving all keys individually...\n');

	for (const category of Object.keys(sampleKeys)) {
		const ids = Object.keys(sampleKeys[category]);
		console.log(`🔍 Category: "${category}" | IDs: ${ids.join(', ')}`);
		const values = await state.keys.get(category as any, ids);

		ids.forEach(id => {
			const expected = JSON.stringify(sampleKeys[category][id]);
			const actual = JSON.stringify(values[id]);

			if (expected === actual) {
				console.log(`✅ [${category}] - [${id}]: Value matches`);
			} else {
				console.error(
					`❌ [${category}] - [${id}]: MISMATCH\nExpected: ${expected}\nActual:   ${actual}`,
				);
			}
		});
		console.log('');
	}

	await delay(100);

	console.log('✏️ [3] Overwriting key: session -> bob');
	const newBobData = {
		id: 'bob',
		session: 'UPDATED',
		timestamp: Date.now() + 1000,
	};
	await state.keys.set({ session: { bob: newBobData } });

	const updatedBob = await state.keys.get('session' as any, ['bob']);
	console.log('🔄 New bob session:', updatedBob['bob']);

	if (updatedBob['bob'].session === 'UPDATED') {
		console.log('✅ Update success.\n');
	} else {
		console.error('❌ Update failed.\n');
	}

	await delay(100);

	console.log('🗑️ [4] Removing session for alice...');
	await state.keys.set({ session: { alice: null } });
	const deleted = await state.keys.get('session' as any, ['alice']);
	console.log('🚮 Post-delete session (alice):', deleted['alice']);

	if (!deleted['alice']) {
		console.log('✅ Deletion success.\n');
	} else {
		console.error('❌ Deletion failed.\n');
	}

	console.log('🔐 [5] Testing credentials save/load...');

	await saveCreds();
	console.log('✅ Credentials saved using saveCreds()\n');

	const creds1 = await state.keys.get('creds' as any, ['']);
	console.log('📄 Retrieved creds:', creds1['']);

	if (creds1['']) {
		console.log('✅ Credentials retrieved.\n');
	} else {
		console.error('❌ Failed to retrieve credentials.\n');
	}

	console.log('🧪 [6] Setting complex nested key...');
	await state.keys.set({
		nested: {
			'deep-user': {
				meta: {
					roles: ['admin', 'editor'],
					active: true,
					profile: {
						name: 'Deep User',
						stats: { logins: 42, lastLogin: new Date().toISOString() },
					},
				},
			},
		},
	});

	const deepUser = await state.keys.get('nested' as any, ['deep-user']);
	console.log(
		'📚 Deep user profile:',
		JSON.stringify(deepUser['deep-user'], null, 2),
	);

	if (deepUser['deep-user']?.meta?.profile?.name === 'Deep User') {
		console.log('✅ Complex object set/retrieved correctly.\n');
	} else {
		console.error('❌ Complex object mismatch.\n');
	}

	console.log('✅✅✅ All tests finished.\n');
})();
