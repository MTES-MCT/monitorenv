
UPDATE public.env_actions SET
  value = jsonb_set(
    value,
		'{themes}',
		jsonb_build_array(
      json_build_object(
          'theme', value->'actionTheme',
          'subThemes', json_build_array(value->>'actionSubTheme')
      )
    ))
    - 'actionTheme' 
    - 'actionSubTheme'
  WHERE 
    value->>'actionTheme' not like '';