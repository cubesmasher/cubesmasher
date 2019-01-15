describe('utils', () => {
	describe('clamp()', () => {
		it('clamps small values', () => {
			expect(clamp(5, 10, 20)).toBe(10);
		});

		it('clamps large values', () => {
			expect(clamp(15, 2, 12)).toBe(12);
		});

		it('does not clamp in-range values', () => {
			expect(clamp(20, 1, 99)).toBe(20);
		});
	});

	describe('lerp()', () => {
		it('preserves start', () => {
			expect(lerp(10, 20, 0)).toBe(10);
		});

		it('preserves end', () => {
			expect(lerp(10, 20, 1)).toBe(20);
		});

		it('interpolates linearly', () => {
			expect(lerp(-100, 100, 0.25)).toBe(-50);
			expect(lerp(-100, 100, 0.5)).toBe(0);
			expect(lerp(-100, 100, 0.75)).toBe(50);
		});
	});

	describe.only('makeCooldown()', () => {
		const resetTime = () => state.game.time = 0;
		const advanceTime = ms => state.game.time += ms;

		describe('1 unit (default)', () => {
			it('can be used immediately after instantiation', () => {
				// Arbitrary start time.
				advanceTime(5000);
				const cooldown = makeCooldown(1000);

				expect(cooldown.canUse()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				// Should be unusable after
				expect(cooldown.canUse()).toBe(false);
				expect(cooldown.useIfAble()).toBe(false);
			});

			it('requires recharging', () => {
				resetTime();
				const cooldown = makeCooldown(1000);

				expect(cooldown.useIfAble()).toBe(true);
				advanceTime(500);
				expect(cooldown.canUse()).toBe(false);
				expect(cooldown.useIfAble()).toBe(false);
				advanceTime(500);
				expect(cooldown.canUse()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
			});

			test('useIfAble() has no side effects when called in an unusable state', () => {
				resetTime();
				const cooldown = makeCooldown(1000);

				cooldown.useIfAble();
				advanceTime(900);
				expect(cooldown.useIfAble()).toBe(false);
				advanceTime(100);
				expect(cooldown.useIfAble()).toBe(true);
			});

			it('depletes immediately no matter how long it was inactive', () => {
				resetTime();
				const cooldown = makeCooldown(1000);

				cooldown.useIfAble();
				advanceTime(50000);
				// Should be plenty recharged
				expect(cooldown.useIfAble()).toBe(true);
				// but should still discharge immediately
				expect(cooldown.canUse()).toBe(false);
				expect(cooldown.useIfAble()).toBe(false);
				// still takes a second to recharge
				advanceTime(1000);
				expect(cooldown.canUse()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
			});

			it('resets with game time reset', () => {
				resetTime();
				const cooldown = makeCooldown(1000);

				// Attempt to simulate semi-realistic use,
				// including a game reset mid-cooldown.
				cooldown.useIfAble();
				advanceTime(5000);
				cooldown.useIfAble();
				advanceTime(2000);
				cooldown.useIfAble();
				advanceTime(400);
				expect(cooldown.canUse()).toBe(false);
				resetTime();
				advanceTime(100);
				expect(cooldown.canUse()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				advanceTime(400);
				expect(cooldown.canUse()).toBe(false);
			});
		});

		describe('3 units', () => {
			it('can be called 3 times in a row', () => {
				resetTime();
				const cooldown = makeCooldown(1000, { numUnits: 3 });

				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.canUse()).toBe(false);
				expect(cooldown.useIfAble()).toBe(false);
			});

			it('can be used again after a single unit is recharged', () => {
				resetTime();
				const cooldown = makeCooldown(1000, { numUnits: 3 });

				cooldown.useIfAble();
				cooldown.useIfAble();
				cooldown.useIfAble();
				expect(cooldown.canUse()).toBe(false);
				advanceTime(500);
				expect(cooldown.canUse()).toBe(false);
				advanceTime(500);
				expect(cooldown.canUse()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.canUse()).toBe(false);
			});

			it('can recharge all units', () => {
				resetTime();
				const cooldown = makeCooldown(1000, { numUnits: 3 });

				cooldown.useIfAble();
				cooldown.useIfAble();
				cooldown.useIfAble();
				advanceTime(3000);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.canUse()).toBe(false);
				// Doesn't "overcharge"
				advanceTime(50000);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.canUse()).toBe(false);
			});

			it('resets all units with game time reset', () => {
				resetTime();
				const cooldown = makeCooldown(1000, { numUnits: 3 });

				cooldown.useIfAble();
				cooldown.useIfAble();
				cooldown.useIfAble();
				expect(cooldown.canUse()).toBe(false);
				advanceTime(1500);
				expect(cooldown.canUse()).toBe(true);
				resetTime();
				advanceTime(100);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.useIfAble()).toBe(true);
				expect(cooldown.canUse()).toBe(false);
			});
		});
	});
});